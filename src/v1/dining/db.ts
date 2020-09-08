import { compareTwoStrings as stringSimilarity } from "string-similarity";
import { ID_MAP, UNITNAME_MAP, DISPLAY_MAP } from "../mapping";
import { DBQuery, DB } from "../db";
import * as Util from "../util";
import { DiningDocument } from "./models/dining";

import * as moment from "moment-timezone";

moment.tz.setDefault("America/New_York");

export class DiningDB extends DB {
  /* eslint-disable no-useless-constructor */
  public constructor(datastore) {
    super(datastore);
  }
  /* eslint-enable */

  async getMenus(
    facilityId?: string,
    startDate?: string,
    endDate?: string,
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
    if (startDate || endDate) {
      const startMoment = startDate && moment(startDate);
      const endMoment = endDate && moment(endDate);
      if (
        (startMoment && startMoment.isValid()) ||
        (endMoment && endMoment.isValid())
      ) {
        result = result.map((e) => {
          return {
            id: e.id,
            weeksMenus: e.weeksMenus.filter((m) => {
              const d = moment(m.date);
              const start = startMoment || moment();
              const end = endMoment || moment().add(7, "d");
              return start <= d && d <= end;
            }),
            location: e.location,
          };
        });
      } else {
        throw new Error("Invalid Date(s)");
      }
    }
    if (menuQuery) {
      const q = menuQuery.toLowerCase();
      result = result.map((e) => {
        return {
          id: e.id,
          weeksMenus: e.weeksMenus.map((weeksMenu) => {
            return {
              date: weeksMenu.date,
              menus: weeksMenu.menus
                .map((menus) => {
                  let menuSimilarity = 0;
                  return {
                    startTime: menus.startTime,
                    endTime: menus.endTime,
                    description: menus.description,
                    menu: menus.menu.filter(({ items }) => {
                      for (const item of items) {
                        const i = item.toLowerCase();
                        const itemSimilarity = stringSimilarity(i, q);
                        if (
                          i.includes(q) ||
                          (q.length < 4 && itemSimilarity > 0.4) ||
                          (q.length < 8 && itemSimilarity > 0.5) ||
                          (q.length < 16 && itemSimilarity > 0.6) ||
                          itemSimilarity > 0.7
                        ) {
                          menuSimilarity = Math.max(
                            menuSimilarity,
                            itemSimilarity
                          );
                        }
                      }
                      return menuSimilarity > 0;
                    }),
                    similarity: menuSimilarity,
                  };
                })
                .filter(({ menu }) => menu.length),
            };
          }),
          location: e.location,
        };
      });
    }
    return [DB.query(result)];
  }
}
