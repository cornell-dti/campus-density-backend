import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Redis } from 'ioredis';
import densityRoutes from './density/routes';
import facilityRoutes from './facilities/routes';
import diningRoutes from './dining/routes';
import feedbackRoutes from './feedback/routes';
import historicalRoutes from './history';

export function generateKey(
  req: express.Request,
  route: string,
  queries: string[]
) {
  const query = queries.map(q => {
    return {
      key: q,
      value: req.query[q]
    };
  });
  const qs = query
    .filter(q => !!q.value)
    .map(({ key, value }) => `${key}=${value}`)
    .join('&');
  return route + (qs && `?${qs}`);
}

export default function routes(redis?: Redis, credentials?) {
  const router = express.Router();

  router.use('/', authenticated);
  router.use(bodyParser.json());
  router.use('/', densityRoutes(redis, credentials));
  router.use('/', facilityRoutes(redis, credentials));
  router.use('/', diningRoutes(redis, credentials));
  router.use('/', historicalRoutes(redis, credentials));
  router.use('/', feedbackRoutes(redis));
  return router;
}
