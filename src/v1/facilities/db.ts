import { ID_MAP, DISPLAY_MAP } from "../mapping";
import { FacilityHourSet, FacilityInfo } from "./models/info";
import { CampusLocation } from "../models/campus";
import { DBQuery, db, DatabaseQuery, DatabaseQueryNoParams } from "../db";
import { FacilityMetadata } from "./models/list";

function getInfo(id: string, hours: FacilityInfoDocument[]): FacilityInfo {
  const date = Math.floor(Date.now() / 1000);

  const facilityHours: FacilityInfoDocument = hours.find(x => x.id === id);

  if (facilityHours && facilityHours.operatingHours) {
    const nextClosing = facilityHours.operatingHours.find(
      e => e.startTimestamp < date && e.endTimestamp > date
    );

    const nextClosingTimestamp = nextClosing ? nextClosing.endTimestamp : -1;

    let nextOpen: FacilityHourSet;

    if (nextClosingTimestamp === -1) {
      // TODO This is broken. Needs to find last opening, not first opening.
      // TODO This may be fixed now... test this.
      nextOpen = facilityHours.operatingHours.reduce(
        (previous, current) =>
          current.startTimestamp > previous.startTimestamp ? current : previous,
        { startTimestamp: 0, endTimestamp: 0 } as FacilityHourSet
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
  } else {
    return null;
  }
}

class FacilityInfoDocument {
  id: string;
  description: string;
  operatingHours: FacilityHourSet[];
  campusLocation: CampusLocation;
}

export class facility_db extends db {
  constructor(datastore) {
    super(datastore);
  }

  async facilityInfo(
    facilityId?: string
  ): Promise<DBQuery<string, FacilityInfo>[]> {
    const { datastore } = this;

    const query = datastore.createQuery("hours");

    try {
      const [hours] = await datastore.runQuery(query);

      if (facilityId) {
        const id = facilityId;

        if (id in ID_MAP) {
          const info = getInfo(id, hours);

          if (info) {
            return [db.query(info, id)];
          }
        }

        throw new Error(`Invalid ID: ${id}`);
      } else {
        return Object.keys(ID_MAP)
          .map(id => getInfo(id, hours))
          .filter(obj => obj != null)
          .map(info => db.query(info));
      }
    } catch (err) {
      console.log(err.message);
      throw new Error(`Failed to access backend.`);
    }
  }

  async facilityList(): Promise<DatabaseQueryNoParams<FacilityMetadata>[]> {
    return Object.keys(DISPLAY_MAP).map(key =>
      db.query(
        FacilityMetadata.assign({
          displayName: DISPLAY_MAP[key],
          id: key
        })
      )
    );
  }
}
