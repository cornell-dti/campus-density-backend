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
import * as admin from 'firebase-admin';
/* eslint-disable @typescript-eslint/no-var-requires */

const Datastore = require('@google-cloud/datastore');

const datastore = Datastore();

/* eslint-enable */

const router = express.Router();

// TODO Validate iOS vendor ids
const UUID_VALIDATE_IOS = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/;

let serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://campus-density.firebaseio.com"
});

export async function authenticated(req, res, next){
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized'); 
    return; 
  }
  try {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const user = await admin.auth().verifyIdToken(idToken);
    next();
  }
  catch {
    res.status(403).send('Unauthorized: Invalid ID'); 
  }
}

export default router;
