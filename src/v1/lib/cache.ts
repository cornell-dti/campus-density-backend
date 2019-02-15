import * as express from 'express';
import { Redis } from 'ioredis';

// A super basic cache of database requests
export function cache(key: (r: express.Request) => string, redis?: Redis) {
  if (redis) {
    return (req, res, next) => {
      redis.on('error', err => {
        next();
      });

      redis.get(key(req), function d(error, data) {
        if (error) {
          // TODO
          throw error;
        }

        if (data) {
          res.status(200).send(data);
        } else {
          next();
        }
      });
    };
  }

  return (req, res, next) => {
    next();
  };
}
