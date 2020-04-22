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

import { Redis } from 'ioredis';
import asyncify from '../lib/asyncify';
import { DensityDB } from './db';
import { cache } from '../lib/cache';
import { getAverageHistoricalData, updateAverages } from '../data/gymHistoricalAnalysis'

import Datastore = require('@google-cloud/datastore');

export default function routes(redis?: Redis, credentials?) {
  const datastore = new Datastore(credentials ? { credentials } : undefined);
  const db = new DensityDB(datastore);

  const router = express.Router();
  const key = req => `/howDense?${req.query.id || ''}`.toLowerCase();

  router.get(
    '/howDense',
    cache(key, redis),
    asyncify(async (req, res) => {
      try {
        const query = await (req.query.id ? db.howDense(req.query.id) : db.howDense());
        const data = JSON.stringify(query.map(v => v.result));

        if (redis) {
          redis.setex(key(req), 60, data);
        }

        res.status(200).send(data);
      } catch (err) {
        res.status(400).send(err);
      }
    })
  );

  router.get(
    '/gymHowDense',
    asyncify(async (req, res) => {
      try {
        const queryResult = await (req.query.id ? db.gymHowDense(req.query.id) : db.gymHowDense());
        const data = JSON.stringify(queryResult)
        res.status(200).send(data);
      } catch (err) {
        console.log(err)
        res.status(400).send(err);
      }
    })
  );

  router.get(
    '/gymHistoricalAverage',
    asyncify(async (req, res) => {
      try {
        const queryResult = await (db.gymHistoricalAverage(req.query.id, req.query.day));
        const data = JSON.stringify(queryResult)
        res.status(200).send(data);
      } catch (err) {
        console.log(err)
        res.status(400).send(err);
      }
    })
  );

  router.get(
    '/testGymQuery',
    async (req, res) => {
      // getAverageHistoricalData('noyes')
      //   .then(result => res.send(result))
      //   .catch(err => console.log(err))
      updateAverages().then(() => res.send('success')).catch((err) => res.send(err))
    }
  )

  return router;
}
