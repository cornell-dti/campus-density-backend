import * as express from 'express';
import { Redis } from "ioredis";
import asyncify from '../lib/asyncify';
import { FeedbackDB } from './db';
import { DISPLAY_MAP } from '../mapping';
import { cache } from "../lib/cache";
import { generateKey } from "../server";


export default function routes(redis?: Redis) {
  const db = new FeedbackDB();
  const router = express.Router();

  const feedbackListKey = (req) => generateKey(req, "/feedbackList", ["location"]);
  router.get('/feedbackList',
    cache(feedbackListKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const list = await (req.query.location ? db.feedbackListLocation(req.query.location) : db.feedbackList(DISPLAY_MAP));

        if (redis) {
          redis.setex(`/feedbackList`, 60_10, list);
        }

        res.status(200).send({
          success: true,
          size: list.length,
          data: list
        });
      } catch (err) {
        res.status(404).send({
          success: false,
          message: "Invalid dining location",
        });
      }
    })
  );

  router.post('/addFeedback',
    asyncify(async (req: express.Request, res: express.Response) => {
      const data = req.body;
      await db.addFeedback(data)
        .then(() => {
          res.status(200).send({ success: true });
        })
        .catch(err => {
          res.status(400).send({
            success: false,
            message: "Unable to create valid feedback. Invalid or missing fields."
          });
        });
    })
  );

  return router
}