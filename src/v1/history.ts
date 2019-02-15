import * as express from 'express';
import { analysis } from './data/historicalAnalysis';

let data = null;

function format(analysis) {
  const formattedHours = () => ({
    '0': -1,
    '1': -1,
    '2': -1,
    '3': -1,
    '4': -1,
    '5': -1,
    '6': -1,
    '7': -1,
    '8': -1,
    '9': -1,
    '10': -1,
    '11': -1,
    '12': -1,
    '13': -1,
    '14': -1,
    '15': -1,
    '16': -1,
    '17': -1,
    '18': -1,
    '19': -1,
    '20': -1,
    '21': -1,
    '22': -1,
    '23': -1
  });

  return analysis.map(({ id, hours }) => {
    const dailyHours = {};

    return Object.entries(hours).map(([k, v]) => {
      dailyHours[k] = Object.assign(formattedHours(), v);
      return {
        id,
        hours: dailyHours
      };
    });
  });
}

export default function handler(req: express.Request, res: express.Response): void {
  if (data == null) {
    data = format(analysis);
  }

  res.status(200).send(JSON.stringify(data));
}
