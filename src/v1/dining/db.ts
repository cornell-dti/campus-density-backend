import { ID_MAP, UNITNAME_MAP, DISPLAY_MAP } from '../mapping';
import { DBQuery, DB } from '../db';
import * as Util from '../util';
import { DiningDocument } from './models/dining';

export class DiningDB extends DB {
  /* eslint-disable no-useless-constructor */
  public constructor(datastore) {
    super(datastore);
  }
  /* eslint-enable */

  async getMenus(facilityId?: string): Promise<DBQuery<string, DiningDocument>[]> {
    const { datastore } = this;
    const query = datastore.createQuery('dining');
    const [entities] = await datastore.runQuery(query);
    if (facilityId) {
      const id = facilityId;
      const entity = entities.find(e => e.id === Util.strip(facilityId));
      if (entity && id in ID_MAP) {
        return [
          DB.query(
            DiningDocument.assign({
              id,
              weeksMenus: entity.weeksMenus
            })
          )
        ];
      }
      throw new Error('Invalid ID');
    } else {
      return entities.map(e => {
        return DB.query(
          DiningDocument.assign({
            id: DISPLAY_MAP[e.id],
            weeksMenus: e.weeksMenus
          })
        );
      });
    }
  }
}
