import { ID_MAP, DISPLAY_MAP, UNITNAME_MAP } from "../mapping";
import { CampusLocation } from "../models/campus";
import { DBQuery, db, DatabaseQuery, DatabaseQueryNoParams } from "../db";
import * as Util from "../util";
import { DensityDocument } from "./models/density";

export class density_db extends db {
  constructor(datastore) {
    super(datastore);
  }

  async howDense(
    facilityId?: string
  ): Promise<DBQuery<string, DensityDocument>[]> {
    const { datastore } = this;
    const query = datastore.createQuery("density", "density_info");
    const [entities, info] = await datastore.runQuery(query);

    if (facilityId) {
      const id = facilityId;
      const entity = entities.find(e => e.id === Util.strip(ID_MAP[id]));
      if (entity && id in ID_MAP) {
        return [
          db.query(
            DensityDocument.fromJSON({
              id,
              density: entity.density
            })
          )
        ];
      } else {
        throw new Error("Invalid ID");
      }
    } else {
      return entities.map(e => {
        return db.query(
          DensityDocument.fromJSON({
            id: UNITNAME_MAP[e.id],
            density: e.density
          })
        );
      });
    }
  }
}
