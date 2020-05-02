import { print } from 'util';
import { ID_MAP, UNITNAME_MAP, GYM_DISPLAY_MAP } from '../mapping';
import { DBQuery, DB } from '../db';
import * as Util from '../util';
import { DensityDocument } from './models/density';
import { firebaseDB } from '../auth';

const DAYS = {
    'Monday': 'M',
    'Tuesday': 'T',
    'Wednesday': 'W',
    'Thursday': 'R',
    'Friday': 'F',
    'Saturday': 'S',
    'Sunday': 'Su'
}

export class DensityDB extends DB {
    /* eslint-disable no-useless-constructor */
    public constructor(datastore) {
        super(datastore);
    }
    /* eslint-enable */

    async howDense(facilityId?: string): Promise<DBQuery<string, DensityDocument>[]> {
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
        const jsonArr = []
        await firebaseDB.collection('gymdata').get().then(async gymsSnapshot => {
            for (const doc of gymsSnapshot.docs) {
                const facId = doc.id
                const gymCountCollection = firebaseDB.collection('gymdata').doc(facId).collection('counts')
                // eslint-disable-next-line no-await-in-loop
                await gymCountCollection.orderBy('time', 'desc').limit(1).get().then(gymCountSnapshot => {
                    const facilityObj: any = {}
                    facilityObj.cardio = gymCountSnapshot.docs[0].get('cardio')
                    facilityObj.weights = gymCountSnapshot.docs[0].get('weights')
                    facilityObj.id = facId
                    jsonArr.push(facilityObj)
                })
            }
        }).catch(err => {
            console.log(err)
        })
        return jsonArr
    }

    async gymHowDense(facilityId?: string) {
        const json: any = {}
        if (facilityId) {
            const gymCountCollection = firebaseDB.collection('gymdata').doc(facilityId).collection('counts')
            await gymCountCollection.orderBy('time', 'desc').limit(1).get().then(snapshot => {
                json.cardio = snapshot.docs[0].get('cardio')
                json.weights = snapshot.docs[0].get('weights')
            }).catch(err => {
                console.log(err)
            })
            return json
        }
        return this.getAllGymsJSONArray()
    }
}