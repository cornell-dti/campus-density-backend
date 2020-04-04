import * as express from 'express';
// eslint-disable-line @typescript-eslint/no-var-requires
import { Redis } from 'ioredis';
import { FacilityDB } from './db';
import { ID_MAP, DISPLAY_MAP, GYM_DISPLAY_MAP } from '../mapping';
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
        const facilityList = await db.facilityList(DISPLAY_MAP);
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

  router.get(
    '/gymFacilityList',
    cache(() => `/gymFacilityList`, redis),
    asyncify(async (req, res) => {
      try {
        const gymFacilityList = await db.facilityList(GYM_DISPLAY_MAP);
        const data = JSON.stringify(gymFacilityList.map(v => v.result));

        if (redis) {
          redis.setex(`/gymFacilityList`, 60 * 10, data)
        }

        res.status(200).send(data)
      } catch (err) {
        res.status(400).send(err)
      }
    })
  )

  const facilityInfoKey = req => (req.query.id ? `/facilityInfo?${req.query.id}` : `/facilityInfo`);

  router.get(
    '/facilityInfo',
    cache(facilityInfoKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const facilityInfo = await (req.query.id ? db.facilityInfo(req.query.id) : db.facilityInfo());
        const data = JSON.stringify(facilityInfo.map(v => v.result));

        if (redis) {
          redis.setex(facilityInfoKey(req), 30, data);
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

  const gymFacilityHoursKey = req => `/gymFacilityHours?${req.query.id || ''}${`&${req.query.date}` || ''}`

  router.get(
    '/gymFacilityHours',
    // cache(gymFacilityHoursKey, redis),
    asyncify(async (req, res) => {
      try {
        const gymFacilityHours = await db.gymFacilityHours(req.query.id, req.query.date);
        const data = JSON.stringify(gymFacilityHours)
        if (redis) {
          redis.setex(facilityHoursKey(req), 60 * 10, data);
        }

        res.status(200).send(data);
      }
      catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err.message);
      }
    })
  )

  return router;
}
