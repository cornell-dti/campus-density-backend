import { JSONParsable, JSONObject } from '../../lib/json';

@JSONParsable({ id: 'string', density: 'number' })
export class DensityDocument extends JSONObject {
  id: string;
  density: number;
}
