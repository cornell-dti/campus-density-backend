import * as express from 'express';

import { RedisClient } from 'redis';
import densityRoutes from './density/routes';
import facilityRoutes from './facilities/routes';
import historicalRoute from './history';
import Auth, { authenticated } from './auth';

export default function routes(redis?: RedisClient) {
  const router = express.Router();

  router.use('/', densityRoutes(redis));
  router.use('/', facilityRoutes);
  router.use('/historicalData', historicalRoute);

  return router;
}
