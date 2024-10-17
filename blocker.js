import fs from "node:fs";
import { LOG } from "./config.js";
import { ProccessLog } from "./controllers/logger.js";
import { JudgeBehavior } from "./controllers/judge.js";

const data = fs.readFileSync(LOG, "utf-8");

// Procesamos el Log y lo metemos a la base de datos
console.log("Iniciado proccess Log");
await ProccessLog(data)

console.log("Completado pasando a leer la tabla");
// Juzgar el comportamiento de las peticiones
await JudgeBehavior();