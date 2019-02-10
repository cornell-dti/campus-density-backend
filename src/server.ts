import v1 from "./v1/server";
import v2 from "./v2/server";

import * as express from "express";

const app = express();

app.use("/v1", v1);
app.use("/v2", v2);

app.listen(process.env.PORT || 3333);

console.log("Running Flux Backend...");
