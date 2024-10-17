import fs from "node:fs";
import { LOG } from "./config.js";
import { ProccessLog } from "./controllers/logger.js";

const data = fs.readFileSync(LOG, "utf-8");

ProccessLog(data);