import * as express from 'express';
import * as Redis from 'ioredis';
import v1 from './v1/server';
import v2 from './v2/server';

let credentials =  undefined;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} else {
  credentials = JSON.parse(process.env.GCLOUD_CONFIG);
}

function use(app: express.Application, redis, credentials) {
  app.use('/v1', v1(redis, credentials));
  app.use('/v2', v2);
}

function runServer(): Promise<any[]> {
  console.log('Starting Flux backend...');

  const app = express();

  return new Promise(resolve => {
    const messages = [];

    try {
      console.log(process.env.REDIS_URL);
      const client = new Redis(process.env.REDIS_URL);

      use(app, client, credentials);

      client.on('connect', () => {
        messages.push('Redis Connected.', 'Flux backend started.');

        resolve([app, messages]);
      });

      client.on('error', err => {
        console.log(`[REDIS ERROR] ${err.message}`);
      });
    } catch (err) {
      messages.push(`Error: ${err}`);

      use(app, undefined, credentials);

      messages.push('Redis not connected...', 'Flux backend started.');

      resolve([app, messages]);
    }
  });
}

runServer()
  .then(([app, messages]) => {
    messages.forEach(message => console.log(message));

    app.listen(process.env.PORT || 3333);
  })
  .catch(err => console.log(err));
