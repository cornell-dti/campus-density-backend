import * as express from 'express';

import { Redis } from 'ioredis';
import densityRoutes from './density/routes';
import facilityRoutes from './facilities/routes';
import historicalRoute from './history';
import Auth, { authenticated } from './auth';

export default function routes(redis?: Redis, credentials?) {
  const router = express.Router();

  router.use('/', densityRoutes(redis, credentials));
  router.use('/', facilityRoutes(undefined, credentials));
  router.use('/historicalData', historicalRoute);

  return router;
}
