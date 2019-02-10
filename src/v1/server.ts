import * as express from "express";
import * as passport from "passport";

import Density from "./density/routes";
import Facilities from "./facilities/routes";
import HistoricalData from "./history";
import Auth, { authenticated } from "./auth";

const router = express.Router();

router.use("/", Density);
router.use("/", Facilities);
router.use("/", HistoricalData);

export default router;
