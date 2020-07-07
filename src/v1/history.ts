import * as express from 'express';
import { Redis } from 'ioredis';
import { analysis } from './data/historicalAnalysis';
import { FacilityDB } from './facilities/db';
import asyncify from './lib/asyncify';
import { cache } from './lib/cache';

import moment = require('moment');
require('moment-timezone');

moment.tz.setDefault('America/New_York');

// inclusive range function
const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);

const formattedHours = () => ({
  '0': -1,
  '1': -1,
  '2': -1,
  '3': -1,
  '4': -1,
  '5': -1,
  '6': -1,
  '7': -1,
  '8': -1,
  '9': -1,
  '10': -1,
  '11': -1,
  '12': -1,
  '13': -1,
  '14': -1,
  '15': -1,
  '16': -1,
  '17': -1,
  '18': -1,
  '19': -1,
  '20': -1,
  '21': -1,
  '22': -1,
  '23': -1
});

function format(analysis) {
  return analysis.map(({ id, history }) => {
    return {
      id,
      hours: history
    };
  });
}

function historicalData(data, id, mask) {
  const d = data.find(v => v.id === id);
  if (d) {
    Object.entries(d.hours).forEach(([k, v]) => {
      d.hours[k] = Object.assign(v, mask[k]);
    });
    return d;
  }
  throw new Error('Invalid ID');
}

async function facilityData(data, id, db) {
  const facilityHours = await db.facilityHours(
    id,
    moment().format('YYYY-MM-DD'),
    moment().add(6, 'd').format('YYYY-MM-DD')
  );
  const results = facilityHours.map(v => v.result)[0];

  const mask = {
    SUN: formattedHours(),
    MON: formattedHours(),
    TUE: formattedHours(),
    WED: formattedHours(),
    THU: formattedHours(),
    FRI: formattedHours(),
    SAT: formattedHours()
  };
  results.hours.forEach(element => {
    const hours = element.dailyHours;
    const start = moment.unix(hours.startTimestamp);
    const end = moment.unix(hours.endTimestamp);
    const day = start.format('ddd').toUpperCase();

    const startHour = start.hour();
    const endHour = end.hour();
    for (const x of range(startHour, endHour)) {
      delete mask[day][x];
    }
  });

  return historicalData(data, id, mask);
}

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore(credentials ? { credentials } : undefined);
  const db = new FacilityDB(datastore);

  const router = express.Router();

  const historicalDataKey = req => `/historicalData?${req.query.id || ''}`;

  router.get(
    '/historicalData',
    // no caching since iOS and android handle historical data differently
    // cache(historicalDataKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        let result;
        const data = format(analysis);
        const { id } = req.query;
        if (id) {
          result = [await facilityData(data, id, db)];
        } else {
          await Promise.all(
            data.map(async facility => facilityData(data, facility.id, db))
          );
          result = data;
        }

        if (redis) {
          redis.setex(historicalDataKey(req), 60 * 10, result);
        }

        res.status(200).send(result);
      } catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err);
      }
    })
  );

  return router;
}
