import { JSONParsable, JSONObject } from '../../lib/json';

// Unused right now
@JSONParsable({ id: 'string', waittime: 'number' })
export class WaitTimeDocument extends JSONObject {
  id: string;
  waittime: number;
}
