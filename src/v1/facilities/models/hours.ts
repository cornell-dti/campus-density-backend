import { JSONParsable, JSONObject } from "../../lib/json";

@JSONParsable({id: "string", startDate: { type: val => val instanceof Date } , endDate: { type: val => val instanceof Date }})
export class FacilityHours extends JSONObject {
  id: string; 
  startDate: Date; 
  endDate: Date; 
}
