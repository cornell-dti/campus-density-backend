import * as express from 'express';
import { hours_db } from './db';
import asyncify from '../lib/asyncify';

const Datastore = require('@google-cloud/datastore'); // eslint-disable-line @typescript-eslint/no-var-requires

const datastore = Datastore();

const router = express.Router();
const db = new hours_db(datastore);

router.get(
  '/facilityHours',
  asyncify(async (req, res) => {
    try {
      const facilityHours = await db.facilityHours();
      res.status(200).send(facilityHours.map(v => v.result.toJSON()));
    } catch (err) {
      // TODO Send actual error codes based on errors. (this applies to all routes)
      res.status(400).send(err);
    }
  })
);