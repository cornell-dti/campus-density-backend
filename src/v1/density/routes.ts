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

import asyncify from '../lib/asyncify';
import { DensityDB } from './db';

import Datastore = require('@google-cloud/datastore');
const datastore = new Datastore();
const router = express.Router();

const db = new DensityDB(datastore);

router.get(
  '/howDense',
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

export default router;
