import { analysis } from "./data/historicalAnalysis";

import * as express from "express";

let data = null;

export default function handler(req: express.Request, res: express.Response) {
  if (data == null) {
    data = Object.entries(analysis).map(([key, val]) => {
      const edit: typeof val = {
        id: val.id,
        hours: { SUN: {}, MON: {}, TUE: {}, WED: {}, THU: {}, FRI: {}, SAT: {} }
      };
      Object.entries(val.hours).forEach(([day, hours]) => {
        for (let x = 0; x <= 23; x += 1) {
          const hoursOfDay = hours[`${x}`];
          
          if (!hoursOfDay) {
            hours[`${x}`] = -1;
          }
        }
      });
    });
  }

  res.status(200).send(JSON.stringify(data));
}
