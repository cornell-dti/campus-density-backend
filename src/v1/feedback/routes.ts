import * as express from "express";
import { Redis } from "ioredis";
import asyncify from "../lib/asyncify";
import { FeedbackDB } from "./db";
import { cache } from "../lib/cache";
import { generateKey } from "../server";

export default function routes(redis?: Redis) {
  const db = new FeedbackDB();
  const router = express.Router();

  const feedbackListKey = (req) =>
    generateKey(req, "/", ["eatery", "day", "hour", "predictedWait"]);
  router.get(
    "/feedbackData",
    cache(feedbackListKey, redis),
    asyncify(async (req: express.Request, res: express.Response) => {
      try {
        const list = await db.getFeedback(
          req.query.eatery,
          req.query.day,
          req.query.hour,
          req.query.predictedWait
        );

        const data = JSON.stringify(list);

        if (redis) {
          redis.setex(`/feedbackData`, 60 * 10, data);
        }

        res.status(200).send({
          success: true,
          data: list,
        });
      } catch (err) {
        res.status(404).send({
          success: false,
          message: "Invalid eatery",
        });
      }
    })
  );

  router.post(
    "/addFeedback",
    asyncify(async (req: express.Request, res: express.Response) => {
      const data = req.body;
      await db
        .addFeedback(data)
        .then(() => {
          res.status(200).send({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: false,
            message: "Unable to create valid feedback.",
          });
        });
    })
  );

  router.post(
    "/addGeneralFeedback",
    asyncify(async (req: express.Request, res: express.Response) => {
      const data = req.body;
      await db
        .addGeneralFeedback(data)
        .then(() => {
          res.status(200).send({ success: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: false,
            message: "Unable to create valid feedback.",
          });
        });
    })
  );

  return router;
}
