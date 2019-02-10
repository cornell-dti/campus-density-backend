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

import Datastore = require("@google-cloud/datastore");
const datastore = new Datastore();

import * as express from "express";
const router = express.Router();

import { ID_MAP, DISPLAY_MAP, UNITNAME_MAP } from "../mapping";

import * as Util from "../util";
import asyncify from "../lib/asyncify";
import { density_db } from "./db";

const db = new density_db(datastore);

router.get(
  "/howDense",
  asyncify(async (req, res) => {
    try {
      if (req.params.id) {
        res
          .status(200)
          .send((await db.howDense(req.params.id)).map(v => v.result));
      } else {
        res.status(200).send((await db.howDense()).map(v => v.result));
      }
    } catch (err) {
      res.status(400).send(err);
    }
  })
);

export default router;
