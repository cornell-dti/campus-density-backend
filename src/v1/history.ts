import * as express from "express";
import { Redis } from "ioredis";
import { analysis } from "./data/historicalAnalysis";
import { FacilityDB } from "./facilities/db";
import { ID_MAP, DISPLAY_MAP, GYM_DISPLAY_MAP } from "./mapping";
import asyncify from "./lib/asyncify";
import { cache } from "./lib/cache";
import moment = require("moment");
require("moment-timezone");

moment.tz.setDefault("America/New_York");

let data = null;

function format(analysis) {
  const formattedHours = () => ({
    "0": -1,
    "1": -1,
    "2": -1,
    "3": -1,
    "4": -1,
    "5": -1,
    "6": -1,
    "7": -1,
    "8": -1,
    "9": -1,
    "10": -1,
    "11": -1,
    "12": -1,
    "13": -1,
    "14": -1,
    "15": -1,
    "16": -1,
    "17": -1,
    "18": -1,
    "19": -1,
    "20": -1,
    "21": -1,
    "22": -1,
    "23": -1,
  });

  return analysis.map(({ id, history }) => {
    const dailyHours = {};
    Object.entries(history).forEach(([k, v]) => {
      dailyHours[k] = Object.assign(formattedHours(), v);
    });

    return {
      id,
      hours: dailyHours,
    };
  });
}

function formatId(analysis, id) {
  return analysis.find((v) => v.id === id);
}

function historicalData(id, mask) {
  if (data == null) {
    data = format(analysis);
  }
  if (id) {
    const d = formatId(data, id);
    if (d) {
      console.log(moment());
      Object.entries(d.hours).forEach(([k, v]) => {
        d.hours[k] = Object.assign(d.hours[k], mask);
      });
      return JSON.stringify([d]);
    } else {
      return "{}";
    }
  }
}

import Datastore = require("@google-cloud/datastore");

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore(credentials ? { credentials } : undefined);
  const db = new FacilityDB(datastore);

  const router = express.Router();

  const historicalDataKey = (req) => `/historicalData?${req.query.id || ""}`;

  router.get(
    "/historicalData",
    cache(historicalDataKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const mask = {};

        const data = historicalData(req.query.id, mask);

        if (redis) {
          redis.setex(historicalDataKey(req), 60 * 10, data);
        }

        res.status(200).send(data);
      } catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err);
      }
    })
  );

  return router;
}
