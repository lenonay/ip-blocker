import fs from "node:fs";
import { execSync } from "node:child_process";
import { exit } from "node:process";

import { LOG, connect } from "./config.js";
import { ProccessLog } from "./controllers/logger.js";
import { JudgeBehavior } from "./controllers/judge.js";
import { ReviewBans } from "./controllers/review.js";
import { CleanLogs } from "./controllers/clean_logs.js";
import { MySQL } from "./models/RegisterToDB.js";

// Temporal hay que quitarlo para un buen funcionamiento
// Elimina todas las reglas del firewall
//console.log("Limpiando el firewall...")
//execSync("sudo bash ./utils/clean_ufw.sh", (error) => { if (error) console.log(error) });
//console.log("Se ha limpiado las reglas del firewall");

// Vaciamos las tablas de IPs
//await connect.query("DELETE FROM IPs");
//console.log("Se ha vaciado la tabla IPs");

// Vaciamos las tablas de baneos
//await connect.query("DELETE FROM Baneos");
//console.log("Se ha vaciado la tabla de baneos");

const innit = new Date();
console.log("----------------------------------");
console.log("Inicio:",innit);

// Verificamos si existe el fichero
const existe = fs.existsSync(LOG);

// Si no existe el fichero validamos todo lo demas
if(!existe){
    console.log("No hay fichero de logs");
    // Verificar la integridad de la DB
    const Validate = await MySQL.Verify();

    if(!Validate) {
        console.log("Faltan tablas necesarias");
        exit(1);
    }
    
    // Juzgar el comportamiento de las peticiones
    console.log("Juzgando las peticiones y las IPs...");
    await JudgeBehavior();

    // Revisar la tabla de baneos para desbanear si es necesario
    console.log("Revisando si hay que desbanear a alguien...");
    await ReviewBans();
    
    // Una vez terminado renombramos el fichero viejo
    console.log("Limpiando ficheros temporales...");
    await CleanLogs();
    
    // Salimos con error
    exit(0);
}

try {
    // Leemos el log
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
    console.log("Limpiando ficheros temporales...")
    await CleanLogs();

    // Salimos del script
    exit(0);


} catch (e) {
    console.log("Error:",e);
    // console.log("No hay fichero de logs, revise la ruta");
    exit(1);
}
