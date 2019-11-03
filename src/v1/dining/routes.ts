import * as express from 'express';
// eslint-disable-line @typescript-eslint/no-var-requires
import { Redis } from 'ioredis';
import { DiningDB } from './db';
import asyncify from '../lib/asyncify';
import { cache } from '../lib/cache';

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore(credentials ? { credentials } : undefined);
  const db = new DiningDB(datastore);

  const router = express.Router();
  router.get(
    '/menuData',
    cache(() => `/menuData`, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const menuList = await (req.query.facility ? db.getMenus(req.query.facility) : db.getMenus());
        const data = JSON.stringify(menuList.map(v => v.result));

        if (redis) {
          redis.setex(`/menuData`, 60 * 10, data);
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