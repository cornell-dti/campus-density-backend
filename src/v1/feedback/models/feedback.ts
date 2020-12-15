import { JSONParsable, JSONObject } from '../../lib/json';

@JSONParsable({
  eatery: 'string',
  predictedWait: 'number',
  observedWait: 'number',
  comment: 'string'
})
export class Feedback extends JSONObject {
  eatery: string;
  predictedWait: number;
  observedWait: number;
  comment?: string;
}

