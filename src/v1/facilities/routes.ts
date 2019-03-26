import * as express from 'express';
// eslint-disable-line @typescript-eslint/no-var-requires
import { Redis } from 'ioredis';
import { FacilityDB } from './db';
import asyncify from '../lib/asyncify';
import { cache } from '../lib/cache';

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore(credentials ? { credentials } : undefined);
  const db = new FacilityDB(datastore);

  const router = express.Router();

  router.get(
    '/facilityList',
    cache(() => `/facilityList`, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const facilityList = await db.facilityList();
        const data = JSON.stringify(facilityList.map(v => v.result));

        if (redis) {
          redis.setex(`/facilityList`, 60 * 10, data);
        }

        res.status(200).send(data);
      } catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err);
      }
    })
  );

  const facilityInfoKey = req => (req.query.id ? `/facilityInfo?${req.query.id}` : `/facilityInfo`);

  router.get(
    '/facilityInfo',
    cache(facilityInfoKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const facilityInfo = await (req.query.id ? db.facilityInfo(req.query.id) : db.facilityInfo());
        const data = JSON.stringify(facilityInfo.map(v => v.result));

        if (redis) {
          redis.setex(`/facilityInfo`, 30, data);
        }

        res.status(200).send(data);
      } catch (err) {
        res.status(400).send(err.message);
      }
    })
  );

  const facilityHoursKey = req =>
    `/facilityHours?${req.query.id || ''}${`&${req.query.startDate}` || ''}${`&${req.query.endDate}` || ''}`;

  router.get(
    '/facilityHours',
    cache(facilityHoursKey, redis),
    asyncify(async (req, res) => {
      try {
        const facilityHours = await db.facilityHours(req.query.id, req.query.startDate, req.query.endDate);
        const data = JSON.stringify(facilityHours.map(v => v.result));


        console.log(facilityHoursKey(req)); 
        if (redis) {
          redis.setex(facilityHoursKey(req), 60 * 10, data);
        }

        res.status(200).send(data);
      } catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err.message);
      }
    })
  );

  return router;
}
