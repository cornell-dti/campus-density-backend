import * as express from 'express';
// eslint-disable-line @typescript-eslint/no-var-requires
import { RedisClient } from 'redis';
import { FacilityDB } from './db';
import asyncify from '../lib/asyncify';

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: RedisClient, credentials?) {
  const datastore = new Datastore({ credentials });
  const db = new FacilityDB(datastore);

  const router = express.Router();
  router.get(
    '/facilityList',
    asyncify(async (req, res) => {
      try {
        const facilityList = await db.facilityList();
        res.status(200).send(facilityList.map(v => v.result.toJSON()));
      } catch (err) {
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err);
      }
    })
  );

  router.get(
    '/facilityInfo',
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

  router.get(
    '/facilityInfo',
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

  router.get(
    '/facilityHours',
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
