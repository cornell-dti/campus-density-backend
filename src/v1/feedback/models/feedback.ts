import { JSONParsable, JSONObject, JSONEnum } from '../../lib/json';
import { CampusLocation } from '../../models/campus';

@JSONParsable({
  id: 'string',
  timeSubmitted: 'number',
  predicted: 'number',
  observed: 'number',
  waitTime: 'number',
  dineIn: 'boolean',
  startDine: 'number',
  endDine: 'number'
})
export class Feedback extends JSONObject {
  id: string;
  timeSubmitted: Date;
  predicted: number;
  observed: number;
  waitTime: number;
  dineIn: boolean;
  startDine: number;
  endDine: number;
  @JSONEnum(CampusLocation)
  campuslocation: CampusLocation;
}

