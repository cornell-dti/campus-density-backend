import { ID_MAP, UNITNAME_MAP } from '../mapping';
import { DBQuery, DB } from '../db';
import * as Util from '../util';
import { DensityDocument } from './models/density';

export class DensityDB extends DB {
  /* eslint-disable no-useless-constructor */
  public constructor(datastore) {
    super(datastore);
  }
  /* eslint-enable */

  async howDense(facilityId?: string): Promise<DBQuery<string, DensityDocument>[]> {
    const { datastore } = this;
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
}
