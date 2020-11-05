import { print } from 'util';
// Unused right now
import { WaitTimeDocument } from './models/waittimes';
import { firebaseDB } from '../auth';

export class WaitTimeDB {

  async waitTime(facilityId?: string) {
    if (facilityId) {
      return (
        await firebaseDB.collection('waittimes').doc('waittimes').get()
      ).get(facilityId);
    }
    return (
      await firebaseDB.collection('waittimes').doc('waittimes').get()
    ).data();
  }

}
