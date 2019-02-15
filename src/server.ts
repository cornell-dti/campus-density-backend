import * as express from 'express';
import * as redis from 'redis';

import v1 from './v1/server';
import v2 from './v2/server';

require('dotenv').config();

const app = express();

const credentials = JSON.parse(process.env.GCLOUD_CONFIG);

function runServer(): Promise<string[]> {
  console.log('Starting Flux backend...');

  return new Promise(resolve => {
    const messages = [];

    if (process.env.ENVIRONMENT === 'production') {
      try {
        const client = redis.createClient(process.env.REDIS_URL);

        app.use('/v1', v1(client, credentials));
        app.use('/v2', v2);

        client.on('connect', () => {
          app.listen(process.env.PORT || 3333);

          messages.push('Redis Connected.', 'Flux backend started.');

          resolve(messages);
        });

        return;
      } catch (err) {
        messages.push(`Error: ${err}`);
      }
    }

    app.use('/v1', v1(undefined, credentials));
    app.use('/v2', v2);

    app.listen(process.env.PORT || 3333);

    messages.push('Redis not connected...', 'Flux backend started.');

    resolve(messages);
  });
}

runServer()
  .then(messages => messages.forEach(message => console.log(message)))
  .catch(err => console.log(err));
