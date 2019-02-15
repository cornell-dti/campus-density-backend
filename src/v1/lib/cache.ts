import * as express from 'express';
import { RedisClient } from 'redis';

// A super basic cache of database requests
export function cache(key: (req: express.Request) => string, redis?: RedisClient) {
  if (redis) {
    return (req, res, next) => {
      redis.get(key(req), (error, data) => {
        if (error) {
          // TODO
          throw error;
        }

        if (data !== null) {
          res.status(400).send(data);
        } else {
          next();
        }
      });
    };
  }

  return (req, res, next) => next();
}
