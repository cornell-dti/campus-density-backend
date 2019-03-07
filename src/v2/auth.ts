import * as express from 'express';
import * as moment from 'moment-timezone';

const currentToken = {
  token: null,
  generated: 0
};

export function authenticated(req: express.Request, res: express.Response, next) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];

  if (currentToken.token) {
    if (idToken === currentToken.token) {
      next();
    } else {
      res.status(403).send('Invalid');
    }
  } else {
    res.status(501).send('Unable to authenticate.');
  }
}

export default function handler(req: express.Request, res: express.Response) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  const apiKey = process.env.AUTH_KEY;

  if (idToken === apiKey) {
    if (currentToken.token && currentToken.generated && moment(currentToken.generated).diff(moment(), 'hours') < 6) {
      res.status(200).send(JSON.stringify({ token: currentToken.token }));
    } else {
      require('crypto').randomBytes(48, (err, buffer) => {
        if (err) {
          return res.status(501).send('Failed to authenticate.');
        }

        const token = buffer.toString('hex');

        currentToken.token = token;
        currentToken.generated = moment.now();

        res.status(200).send(JSON.stringify({ token }));
      });
    }
  } else {
    res.status(401).send('Unauthorized');
  }
}
