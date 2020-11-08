import * as express from 'express';
import asyncify from '../lib/asyncify';
import { FeedbackDB } from './db';
import { ID_MAP, DISPLAY_MAP, GYM_DISPLAY_MAP } from '../mapping';
import { resolveSoa } from 'dns';
import { request } from 'http';


export default function routes() {
  const db = new FeedbackDB();
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

  router.post('/addFeedback',
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        let data = req.body;
        await db.addFeedback(data);
        res.status(200).send(data);
      } catch (err) {
        res.status(400).send(err);
      }
    })
  );

  return router
}