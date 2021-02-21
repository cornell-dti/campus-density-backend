import * as express from 'express';
import { Redis } from 'ioredis';
import { WaitTimeDB } from './db';
import asyncify from '../lib/asyncify';
import { cache } from '../lib/cache';
import { generateKey } from '../server';

import bodyParser = require('body-parser');

export default function routes(redis?: Redis, credentials?) {
  const db = new WaitTimeDB();

  const router = express.Router();
  router.use(bodyParser.json());

  const key = req => generateKey(req, '/waitTime', ['id']);
  router.get(
    '/waitTime',
    cache(key, redis),
    asyncify(async (req, res) => {
      try {
        const query = await (db.waitTime(req.query.id));

        if (query) {
          const data = JSON.stringify(query);

          if (redis) {
            redis.setex(key(req), 60, data);
          }

          res.status(200).send(data);
        }
        else {
          res.status(400).send({ success: false, error: 'No such facility id.' });
        }
      } catch (err) {
        console.log(err);
        res.status(400).send({ success: false, error: err.message });
      }
    })
  );

  return router;
}
