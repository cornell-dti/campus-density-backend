import * as express from 'express';
// eslint-disable-line @typescript-eslint/no-var-requires
import { Redis } from 'ioredis';
import { FacilityDB } from './db';
import asyncify from '../lib/asyncify';
import { cache } from '../lib/cache';

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore({ credentials });
  const db = new FacilityDB(datastore);

  const router = express.Router();

  router.get(
    '/facilityList',
    cache(() => `/facilityList`, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const facilityList = await db.facilityList();
        res.status(200).send(facilityList.map(v => v.result.toJSON()));
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
        res
          .status(200)
          .send((await (req.query.id ? db.facilityInfo(req.query.id) : db.facilityInfo())).map(v => v.result));
      } catch (err) {
        res.status(400).send(err.message);
      }
    })
  );

  const facilityHoursKey = req => (req.query.id ? `/facilityHours?${req.query.id}` : `/facilityHours`);

  router.get(
    '/facilityHours',
    cache(facilityHoursKey, redis),
    asyncify(async (req, res) => {
      try {
        const facilityHours = await db.facilityHours(req.query.id, req.query.startDate, req.query.endDate);
        res.status(200).send(facilityHours.map(v => v.result.toJSON()));
      } catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err);
      }
    })
  );

  return router;
}
