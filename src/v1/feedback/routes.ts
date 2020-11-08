import * as express from 'express';
import asyncify from '../lib/asyncify';
import { FeedbackDB } from './db';
import { DISPLAY_MAP } from '../mapping';

export default function routes() {
  const db = new FeedbackDB();
  const router = express.Router()

  router.get('/feedbackList',
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const { location } = req.query.location;
        const feedbackList = JSON.stringify(await db.feedbackList(DISPLAY_MAP, location));
        res.status(200).send(feedbackList);
      } catch (err) {
        res.status(400).send(err);
      }
    })
  );

  router.post('/addFeedback',
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const data = req.body;
        await db.addFeedback(data);
        res.status(200).send(data);
      } catch (err) {
        res.status(400).send(err);
      }
    })
  );

  return router
}