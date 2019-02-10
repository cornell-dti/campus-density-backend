import {
  JSONParsable,
  JSONObject,
  JSONObjProperty,
  JSONEnum
} from "../../lib/json";
import { CampusLocation } from "../../models/campus";

@JSONParsable({
  startTimestamp: "number",
  endTimestamp: "number"
})
export class FacilityHourSet extends JSONObject {
  startTimestamp: number;
  endTimestamp: number;
}

@JSONParsable({
  id: "string",
  nextOpen: "number",
  closingAt: "number",
  isOpen: "boolean"
})
export class FacilityInfo extends JSONObject {
  id: string;
  @JSONEnum(CampusLocation)
  campusLocation: CampusLocation;
  nextOpen: number;
  description: string;
  isOpen: boolean;
  closingAt: number;
  @JSONObjProperty(FacilityHourSet)
  dailyHours: FacilityHourSet[];
}
