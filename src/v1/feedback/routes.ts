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
        const feedbackList = JSON.stringify(await db.feedbackList(DISPLAY_MAP));
        // const data = JSON.stringify(feedbackList.map(obj => obj.id));
        // console.log(data);
        console.log(feedbackList);
        res.status(200).send(feedbackList);

        // await db.feedbackList(DISPLAY_MAP, "becker").then(fbList => {
        //   const data = JSON.stringify(fbList);
        //   console.log(data);
        //   res.status(200).send(data);
        // });
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