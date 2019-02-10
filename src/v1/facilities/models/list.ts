import { JSONParsable, JSONObject } from "../../lib/json";

@JSONParsable({
  displayName: "string",
  id: "string"
})
export class FacilityMetadata extends JSONObject {
  displayName: string;
  id: string;
}
