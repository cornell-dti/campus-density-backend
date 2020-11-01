import * as express from 'express';
import asyncify from '../lib/asyncify';
import { FeedbackDB } from './db';
import { firebaseDB } from "../auth";
import { ID_MAP, DISPLAY_MAP, GYM_DISPLAY_MAP } from '../mapping';
// import { Redis } from 'ioredis';

export default function routes() {
  // const firestore = new Firestore(credentials ? { credentials } : undefined);
  const db = FeedbackDB;
  const router = express.Router()

  // return feedback objects
  router.get('/feedbackList',
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const feedbackList = await db.feedbackList(DISPLAY_MAP);
        const data = JSON.stringify(feedbackList.map(v => v.result));
        res.status(200).send(data);
      } catch (err) {
        res.status(400).send(err);
      }
    })
  );

  router.post('/ENDPOINT_NAME',
    asyncify(async (req, res) => {
      try {
        // TODO: db operation
      } catch (err) {

      }
    })
  );
}