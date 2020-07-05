import { JSONParsable, JSONObject, typedefs, JSONArray } from "../../lib/json";
import { FacilityHourSet } from "./info";

@JSONParsable({
  date: "string",
  dayOfWeek: "number",
  status: "number",
  statusText: "string",
})
export class DailyHours extends JSONObject {
  date: string;
  dayOfWeek: number;
  status: number;
  statusText: string;
  @JSONArray(FacilityHourSet)
  dailyHours: FacilityHourSet;
}

@JSONParsable({ id: "string" })
export class FacilityHours extends JSONObject {
  id: string;
  @JSONArray(DailyHours)
  hours: DailyHours[];
}
