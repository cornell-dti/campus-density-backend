import { ID_MAP, UNITNAME_MAP, DISPLAY_MAP } from "../mapping";
import { DBQuery, DB } from "../db";
import * as Util from "../util";
import { DiningDocument } from "./models/dining";

export class DiningDB extends DB {
  /* eslint-disable no-useless-constructor */
  public constructor(datastore) {
    super(datastore);
  }
  /* eslint-enable */

  async getMenus(
    facilityId?: string,
    date?: string,
    menuQuery?: string
  ): Promise<DBQuery<string, DiningDocument>[]> {
    const { datastore } = this;
    const diningQuery = datastore.createQuery("dining");
    let [entities] = await datastore.runQuery(diningQuery);
    entities = entities.filter((e) => e.id in ID_MAP);
    let result = entities;
    if (facilityId) {
      if (facilityId in ID_MAP) {
        result = result.filter((e) => e.id === facilityId);
      }
    }
    if (date) {
      let d = date;
      const lowercaseInput = date.toLowerCase();
      const dt = new Date();
      if (lowercaseInput === "today") {
        d = dt.toISOString().slice(0, 10);
      } else if (lowercaseInput === "tomorrow") {
        dt.setDate(dt.getDate() + 1);
        d = dt.toISOString().slice(0, 10);
      } else if (lowercaseInput === "yesterday") {
        dt.setDate(dt.getDate() - 1);
        d = dt.toISOString().slice(0, 10);
      }
      if (!Number.isNaN(Date.parse(d))) {
        result = result.map((e) => {
          return {
            id: e.id,
            weeksMenus: e.weeksMenus.filter((m) => m.date === d),
          };
        });
      } else {
        throw new Error("Invalid Date");
      }
    }
    if (menuQuery) {
    }
    return [DB.query(result)];
  }
}
