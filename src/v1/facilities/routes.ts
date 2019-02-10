const Datastore = require("@google-cloud/datastore");
const datastore = Datastore();

import * as express from "express";
import { facility_db } from "./db";
import asyncify from "../lib/asyncify";

const router = express.Router();
const db = new facility_db(datastore);

router.get(
  "/facilityList",
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
  "/facilityInfo",
  asyncify(async (req, res) => {
    try {
      res
        .status(200)
        .send(
          (await (req.params.id
            ? db.facilityInfo(req.params.id)
            : db.facilityInfo())).map(v => v.result)
        );
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
);

export default router;
