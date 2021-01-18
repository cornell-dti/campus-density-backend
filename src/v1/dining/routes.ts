import * as express from 'express';
// eslint-disable-line @typescript-eslint/no-var-requires
import { Redis } from 'ioredis';
import { DiningDB } from './db';
import asyncify from '../lib/asyncify';
import { cache } from '../lib/cache';
import { generateKey } from '../server';

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore(credentials ? { credentials } : undefined);
  const db = new DiningDB(datastore);

  const router = express.Router();

  const menuKey = req =>
    generateKey(req, '/menuData', [
      'id',
      'facility',
      'startDate',
      'endDate',
      'q'
    ]);
  router.get(
    '/menuData',
    cache(menuKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const menuList = await db.getMenus(
          req.query.id || req.query.facility, // TODO: Remove req.query.facility as soon as clients migrate to id
          req.query.startDate,
          req.query.endDate,
          req.query.q
        );
        const data = JSON.stringify(menuList.map(v => v.result)[0]);

        if (redis) {
          redis.setex(`/menuData`, 60 * 10, data);
        }

        res.status(200).send(data);
      } catch (err) {
        console.log(err);
        // TODO Send actual error codes based on errors. (this applies to all routes)
        res.status(400).send(err);
      }
    })
  );

  return router;
}
