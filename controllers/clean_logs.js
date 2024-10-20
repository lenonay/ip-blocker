import fs from "node:fs/promises";
import { LOG } from "../config.js";

export async function CleanLogs(){
    // Renombramos el log para que todo funcione OK.
    const result = fs.rename(LOG, `${LOG}.old`);
}