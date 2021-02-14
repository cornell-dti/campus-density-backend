import { JSONParsable, JSONObject } from "../../lib/json";

@JSONParsable({
  eatery: "string",
  predictedWait: "number",
  observedWait: "number",
  comment: "string",
})
export class Feedback extends JSONObject {
  eatery: string;
  predictedWait: number;
  observedWait: number;
  comment?: string;
}

export class FluxFeedback extends JSONObject {
  // How likely are you to recommend Flux to a friend?
  likelyToRecommend: number;
  // What features do you find useful? 1 - Popular times; 2 - Availability breakdown; 3 - Dining Areas; 4 - Menu
  usefulFeatures: number[];
  // How do you like flux overall
  likeFluxOverall: number;
  // other comments
  comment?: string;
}
