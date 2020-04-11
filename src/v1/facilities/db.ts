import * as moment from 'moment-timezone'
import * as admin from 'firebase-admin';
import { ID_MAP, DISPLAY_MAP, GYM_DISPLAY_MAP } from '../mapping';
import { FacilityHourSet, FacilityInfo } from './models/info';
import { CampusLocation } from '../models/campus';
import { DBQuery, DB, DatabaseQueryNoParams } from '../db';
import { FacilityMetadata } from './models/list';
import { FacilityHours, DailyHours } from './models/hours';

const fb_db = admin.firestore()

function getInfo(id: string, hours: FacilityInfoDocument[]): FacilityInfo {
  const date = Math.floor(Date.now() / 1000);

  const facilityHours: FacilityInfoDocument = hours.find(x => x.id === id);

  if (facilityHours && facilityHours.operatingHours) {
    const nextClosing = facilityHours.operatingHours.find(e => e.startTimestamp < date && e.endTimestamp > date);

    const nextClosingTimestamp = nextClosing ? nextClosing.endTimestamp : -1;

    let nextOpen: FacilityHourSet;

    if (nextClosingTimestamp === -1) {
      // TODO This is broken. Needs to find last opening, not first opening.
      // TODO This may be fixed now... test this.
      nextOpen = facilityHours.operatingHours.reduce(
        (previous, current) => (current.startTimestamp > previous.startTimestamp ? current : previous),
        FacilityHourSet.assign({ startTimestamp: 0, endTimestamp: 0 })
      );
    }

    return FacilityInfo.assign({
      id: facilityHours.id,
      campusLocation: facilityHours.campusLocation,
      nextOpen: (nextOpen && nextOpen.startTimestamp) || -1,
      isOpen: nextClosingTimestamp !== -1,
      description: facilityHours.description,
      closingAt: nextClosingTimestamp,
      dailyHours: facilityHours.operatingHours
    });
  }
  return null;
}

function getHoursInfo(id: string, hours: FacilityHoursDocument[], startDate: string, endDate: string): FacilityHours {
  // need to go through hours and find those between specified start and end date
  // in the DailyHours object we create, we will have a FacilityHourSet[]. We will create a new DailyHours object
  // for every date in the range, and in the FacilityHourSet[] for each of these DailyHours objects, we put
  // all time ranges for that given date.
  // Add all the DailyHours objects to an array, and return a FacilityHours object where hours is assigned to this
  // array.
  const dateBegin = moment(startDate, 'MM-DD-YY').tz('America/New_York').unix()
  const dateEnd = moment(endDate, 'MM-DD-YY').tz('America/New_York').unix()
  const facilityId = id;
  const validDailyHours = []
  for (const doc of hours) {
    if (doc.id === id) {
      for (const facilityHours of doc.hours) {
        if (dateBegin <= moment(facilityHours.date, 'YYYY-MM-DD').tz('America/New_York').unix()
          && dateEnd >= moment(facilityHours.date, 'YYYY-MM-DD').tz('America/New_York').unix()) {
          validDailyHours.push(
            DailyHours.assign({
              date: facilityHours.date,
              dayOfWeek: facilityHours.dayOfWeek,
              status: facilityHours.status,
              statusText: facilityHours.statusText,
              dailyHours: facilityHours.dailyHours
            })
          );
        }
      }
    }
  }
  return FacilityHours.assign({
    id: facilityId,
    hours: validDailyHours
  });
}

class FacilityHoursDocument {
  id: string;
  hours: DailyHours[];
}

class FacilityInfoDocument {
  id: string;
  description: string;
  operatingHours: FacilityHourSet[];
  campusLocation: CampusLocation;
}

export class FacilityDB extends DB {
  public constructor(datastore) {
    super(datastore);
  }

  async facilityInfo(facilityId?: string): Promise<DBQuery<string, FacilityInfo>[]> {
    const { datastore } = this;

    const query = datastore.createQuery('hours');

    try {
      const [hours] = await datastore.runQuery(query);

      if (facilityId) {
        const id = facilityId;

        if (id in ID_MAP) {
          const info = getInfo(id, hours);

          if (info) {
            return [DB.query(info, id)];
          }
        }

        throw new Error(`Invalid ID: ${id}`);
      } else {
        return Object.keys(ID_MAP)
          .map(id => getInfo(id, hours))
          .filter(obj => obj != null)
          .map(info => DB.query(info));
      }
    } catch (err) {
      console.log(err.message);
      throw new Error(`Failed to access backend.`);
    }
  }

  async facilityList(facilityListType):
  /* eslint-disable-line class-methods-use-this */ Promise<
    DatabaseQueryNoParams<FacilityMetadata>[]> {
    return Object.keys(facilityListType).map(key =>
      DB.query(
        FacilityMetadata.assign({
          displayName: facilityListType[key],
          id: key
        })
      )
    );
  }

  // Should I just go ahead and delete these then
  async efacilityList(): /* eslint-disable-line class-methods-use-this */ Promise<
    DatabaseQueryNoParams<FacilityMetadata>[]> {
    return Object.keys(DISPLAY_MAP).map(key =>
      DB.query(
        FacilityMetadata.assign({
          displayName: DISPLAY_MAP[key],
          id: key
        })
      )
    );
  }

  async gymFacilityList(): Promise<
    DatabaseQueryNoParams<FacilityMetadata>[]> {
    return Object.keys(GYM_DISPLAY_MAP).map(key =>
      DB.query(
        FacilityMetadata.assign({
          displayName: DISPLAY_MAP[key],
          id: key
        })
      )
    );
  }

  async gymFacilityHours(
    facilityId?: string, date?: string
  ) {
    if (facilityId) {

    }
    return (await fb_db.collection('gymInfo').doc('noyes').get()).data();
  }

  async facilityHours(
    facilityId?: string, startDate?: string, endDate?: string
  ): Promise<DBQuery<string, FacilityHours>[]> {
    const { datastore } = this;
    const query = datastore.createQuery('development-testing-hours');
    try {
      const [hoursrange] = await datastore.runQuery(query);
      if (facilityId) {
        if (startDate && endDate) {
          const id = facilityId;
          if (id in ID_MAP) {
            const hoursInfo = getHoursInfo(id, hoursrange, startDate, endDate);

            if (hoursInfo) {
              return [DB.query(hoursInfo, id)];
            }
          }
          else {
            throw new Error(`Invalid ID`);
          }
        }
        else {
          throw new Error(`Missing start and/or end date`);
        }
      }
      else {
        if (startDate && endDate) {
          return Object.keys(ID_MAP)
            .map(id => getHoursInfo(id, hoursrange, startDate, endDate))
            .filter(obj => obj != null)
            .map(info => DB.query(info));
        }
        throw new Error(`Missing start and/or end date`);
      }
      throw new Error(`Need to include dates and facility id`);
    }
    catch (err) {
      throw new Error(err.message);
    }
  }
}
