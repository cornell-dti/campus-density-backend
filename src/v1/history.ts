import * as express from "express";
import { analysis } from "./data/historicalAnalysis";

let data = null;

export default function handler(
  req: express.Request,
  res: express.Response
): void {
  if (data == null) {
    data = analysis; // TODO Fill in missing hours with -1
  }

  res.status(200).send(JSON.stringify(data));
}
