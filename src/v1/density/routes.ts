/**
 *  Campus Density Backend
 *  Copyright (C) 2018 Cornell Design & Tech Initiative
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License only.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as express from 'express';

import { RedisClient } from 'redis';
import asyncify from '../lib/asyncify';
import { DensityDB } from './db';
import { cache } from '../lib/cache';

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: RedisClient, credentials?) {
  const datastore = new Datastore({ credentials });
  const db = new DensityDB(datastore);

  const router = express.Router();

  router.get(
    '/howDense',
    cache(req => `/howDense?${req.query.id || ''}`.toLowerCase(), redis),
    asyncify(async (req, res) => {
      try {
        if (req.query.id) {
          res.status(200).send((await db.howDense(req.query.id)).map(v => v.result));
        } else {
          res.status(200).send((await db.howDense()).map(v => v.result));
        }
      } catch (err) {
        res.status(400).send(err);
      }
    })
  );

  return router;
}
