import fs from "node:fs";
import { LOG } from "./config.js";
import { ProccessLog } from "./controllers/logger.js";

const data = fs.readFileSync(LOG, "utf-8");

// Procesamos el Log y lo metemos a la base de datos
await ProccessLog(data)
