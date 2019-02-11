/**
 *  Campus Density Backend
 *  Copyright (C) 2018 Cornell Design & Tech Initiative
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License only.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as express from 'express';

/* eslint-disable @typescript-eslint/no-var-requires */

const Datastore = require('@google-cloud/datastore');

const datastore = Datastore();

/* eslint-enable */

const router = express.Router();

// TODO Validate iOS vendor ids
const UUID_VALIDATE_IOS = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/;

export function authenticated(route): (req, res) => void {
  return (...params) => {
    const [req, res] = params;

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(403).send('Unauthorized');
      return;
    }

    const idToken = req.headers.authorization.split('Bearer ')[1];
    const apiKey = process.env.AUTH_KEY;

    if (idToken === apiKey) {
      const token = req.headers['x-api-key'];
      const query = datastore.createQuery('auth', 'auth_info').filter('token', '=', token);

      datastore.runQuery(query, (err, tokens) => {
        if (err) {
          res.status(500).send('Failed to access token tables');
          return;
        }

        if (/* Array.from( */ tokens /* ) */.length === 1) {
          if (tokens[0].ios) {
            route(...params, {
              ios: true
            });
            return;
          }
          route(...params, {});
        } else {
          res.status(403).send('Unauthorized');
        }
      });

      // TODO Add receipt/instanceId authentication
      // const receipt = req.body.receipt;
      // const instanceId = req.body.instanceId;
    } else {
      res.status(403).send('Unauthorized');
    }
  };
}

export default router;
