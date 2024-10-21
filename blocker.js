import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { exit } from "node:process";

import { LOG, connect } from "./config.js";
import { ProccessLog } from "./controllers/logger.js";
import { JudgeBehavior } from "./controllers/judge.js";
import { ReviewBans } from "./controllers/review.js";
import { CleanLogs } from "./controllers/clean_logs.js";

// Temporal hay que quitarlo para un buen funcionamiento
// Elimina todas las reglas del firewall
execSync("sudo bash ./utils/clean_ufw.sh", (error) => { if (error) console.log(error) });
console.log("Se ha limpiado las reglas del firewall");

// Vaciamos las tablas de IPs
await connect.query("DELETE FROM IPs");
console.log("Se ha vaciado la tabla IPs");

// Vaciamos las tablas de baneos
await connect.query("DELETE FROM Baneos");
console.log("Se ha vaciado la tabla de baneos");

// Verificamos si existe el fichero
const existe = fs.existsSync(LOG);

// Si no existe el fichero validamos todo lo demas
if(!existe){
    console.log("No hay fichero de logs");
    
    // Juzgar el comportamiento de las peticiones
    console.log("Juzgando las peticiones y las IPs...");
    await JudgeBehavior();

    // Revisar la tabla de baneos para desbanear si es necesario
    console.log("Revisando si hay que desbanear a alguien...");
    await ReviewBans();
    
    // Una vez terminado renombramos el fichero viejo
    console.log("Limpiand ficheros temporales...")
    await CleanLogs();
    
    exit(1);
}

try {
    const data = fs.readFileSync(LOG, "utf-8");

    // Procesamos el Log y lo metemos a la base de datos
    console.log("Procesando el log...");
    await ProccessLog(data)

    // Juzgar el comportamiento de las peticiones
    console.log("Juzgando las peticiones...");
    await JudgeBehavior();

    // Revisar la tabla de baneos para desbanear si es necesario
    console.log("Revisando si hay que desbanear a alguien...");
    await ReviewBans();

    // Una vez terminado renombramos el fichero viejo
    console.log("Limpiand ficheros temporales...")
    await CleanLogs();

    // Salimos del archivo

    exit(0)

} catch (e) {
    console.log("Error:",e);
    // console.log("No hay fichero de logs, revise la ruta");
    exit(1);
}
