import { JSONParsable, JSONObject } from '../../lib/json';

@JSONParsable({
  timeSubmitted: 'number',
  isAccurate: 'boolean',
  predicted: 'number',
  observed: 'number',
  waitTime: 'number',
  dineIn: 'boolean',
  startDine: 'number',
  endDine: 'number',
  comments: 'string'
})
export class Feedback extends JSONObject {
  timeSubmitted: Date;
  isAccurate: boolean;
  predicted: number;
  observed: number;
  waitTime: number;
  dineIn: boolean;
  startDine: number;
  endDine: number;
  campuslocation: string;
  comments: string;
}

