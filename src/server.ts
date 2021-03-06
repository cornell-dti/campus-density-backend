import * as express from 'express';
import * as Redis from 'ioredis';

/* env.ts must be first non-dependency import */
import './env';
import v1 from './v1/server';
import v2 from './v2/server';

function use(app: express.Application, redis, credentials) {
  app.use('/v1', v1(redis, credentials));
  app.use('/v2', v2);
  app.use(express.json())
}

function runServer(startRedis?: boolean): Promise<any[]> {
  console.log('Starting Flux backend...');

  let credentials;

  if (process.env.GCLOUD_CONFIG) {
    credentials = JSON.parse(process.env.GCLOUD_CONFIG);
  }

  const app = express();

  return new Promise(resolve => {
    const messages = [];

    try {
      if (startRedis) {
        const client = process.env.REDISTOGO_URL ? new Redis(process.env.REDISTOGO_URL) : new Redis();
        use(app, client, credentials);

        client.on('connect', () => {
          messages.push('Redis Connected.', 'Flux backend started.');

          resolve([app, messages]);
        });

        client.on('error', err => {
          console.log(`[REDIS ERROR] ${err.message}`);
        });
      } else {
        use(app, undefined, credentials);
        messages.push('Redis disabled...', 'Flux backend started.');

        resolve([app, messages]);
      }
    } catch (err) {
      messages.push(`Error: ${err}`);

      use(app, undefined, credentials);

      messages.push('Redis not connected...', 'Flux backend started.');

      resolve([app, messages]);
    }
  });
}

runServer(!process.argv.includes('--no-redis'))
  .then(([app, messages]) => {
    messages.forEach(message => console.log(message));

    app.listen(process.env.PORT || 5000);
  })
  .catch(err => console.log(err));
