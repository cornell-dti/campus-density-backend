import {ID_MAP,UNITNAME_MAP} from '../mapping';
import {DBQuery,DB} from '../db';
import * as Util from '../util';
import {DensityDocument} from './models/density';
import {firebaseDB} from '../auth';
import {print} from 'util';

export class DensityDB extends DB {
    /* eslint-disable no-useless-constructor */
    public constructor(datastore) {
        super(datastore);
    }
    /* eslint-enable */

    async howDense(facilityId ? : string): Promise < DBQuery < string, DensityDocument > [] > {
        const {
            datastore
        } = this;
        const query = datastore.createQuery('density', 'density_info');
        const [entities] = await datastore.runQuery(query);
        if (facilityId) {
            const id = facilityId;
            const entity = entities.find(e => e.id === Util.strip(ID_MAP[id]));
            if (entity && id in ID_MAP) {
                return [
                    DB.query(
                        DensityDocument.fromJSON({
                            id,
                            density: entity.density
                        })
                    )
                ];
            }
            throw new Error('Invalid ID');
        } else {
            return entities.map(e => {
                return DB.query(
                    DensityDocument.fromJSON({
                        id: UNITNAME_MAP[e.id],
                        density: e.density
                    })
                );
            });
        }
    }

    async getAllGymsJSONArray() {
      let jsonArr = []
      await firebaseDB.collection('gymdata').get().then(async gymsSnapshot => {
        for (var doc of gymsSnapshot.docs) {
            let facId = doc.id
            const gymCountCollection = firebaseDB.collection('gymdata').doc(facId).collection('counts')
            // eslint-disable-next-line no-await-in-loop
            await gymCountCollection.orderBy('time', 'desc').limit(1).get().then(gymCountSnapshot => {
                let facilityObj = {}
                facilityObj['cardio'] = gymCountSnapshot.docs[0].get('cardio')
                facilityObj['weights'] = gymCountSnapshot.docs[0].get('weights')
                facilityObj['id'] = facId
                jsonArr.push(facilityObj)
            })
        }
    }).catch(err => {
        console.log(err)
    })
      return jsonArr
    }

    async gymHowDense(facilityId ? : string) {
        let json = {}
        if (facilityId) {
            const gymCountCollection = firebaseDB.collection('gymdata').doc(facilityId).collection('counts')
            await gymCountCollection.orderBy('time', 'desc').limit(1).get().then(snapshot => {
                json['cardio'] = snapshot.docs[0].get('cardio')
                json['weights'] = snapshot.docs[0].get('weights')
            }).catch(err => {
                console.log(err)
            })
            return json
        }
        return this.getAllGymsJSONArray()
    }

    async gymHistoricalAverage(facilityId ? : string, day? : string) {
        let json = {}
        const gymHistoryDocument = firebaseDB.collection('gyms').doc(facilityId).collection('history').doc(day);
        await gymHistoryDocument.get().then(snapshot => {
            json = snapshot.data()
        });
        return json
    }
}