import fs from "node:fs";
import { execSync } from "node:child_process";
import { LOG } from "./config.js";
import { ProccessLog } from "./controllers/logger.js";
import { JudgeBehavior } from "./controllers/judge.js";
import { ReviewBans } from "./controllers/review.js";

// Temporal hay que quitarlo para un buen funcionamiento
execSync("sudo bash ./utils/clean_ufw.sh", (error) => { if (error) console.log(error) });

const data = fs.readFileSync(LOG, "utf-8");

// Procesamos el Log y lo metemos a la base de datos
await ProccessLog(data)

// Juzgar el comportamiento de las peticiones
await JudgeBehavior();

// Revisar la tabla de baneos para desbanear si es necesario
await ReviewBans();