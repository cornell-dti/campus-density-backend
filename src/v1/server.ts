import * as express from 'express';

import { Redis } from 'ioredis';
import densityRoutes from './density/routes';
import facilityRoutes from './facilities/routes';
import diningRoutes from './dining/routes';
import historicalRoute from './history';
import Auth, { authenticated } from './auth';

export default function routes(redis?: Redis, credentials?) {
  const router = express.Router();

  router.use('/', authenticated);
  router.use('/', densityRoutes(redis, credentials));
  router.use('/', facilityRoutes(redis, credentials));
  router.use('/', diningRoutes(redis, credentials));
  router.get('/historicalData', historicalRoute);

  return router;
}
