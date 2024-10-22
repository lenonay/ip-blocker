import fs from "node:fs/promises";
import { LOG } from "../config.js";

export async function CleanLogs(){
    // Renombramos el log para que todo funcione OK.
    fs.copyFile(LOG, `${LOG}.old`);
    fs.writeFile(LOG, "");

    console.log("Se ha limpiado el log");
}