import { print } from 'util';
// Unused right now
import { WaitTimeDocument } from './models/waittimes';
import { firebaseDB } from '../auth';
import { ID_MAP } from '../mapping';

export class WaitTimeDB {

  async waitTime(facilityId?: string) {
    if (facilityId) {
      return (
        await firebaseDB.collection('waittimes').doc('waittimes').get()
      ).get(facilityId);
    }
    const waittimes = (
      await firebaseDB.collection('waittimes').doc('waittimes').get()
    ).data();

    const waittimesFormatted = new Map();
    Object.keys(ID_MAP).forEach(element => {
      waittimesFormatted[element] = waittimes[ID_MAP[element]];
    });

    return waittimesFormatted;
  }

}
