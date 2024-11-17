import fs from "node:fs/promises";
import { LOG } from "../config.js";

export async function CleanLogs(){
    // Renombramos el log para que todo funcione OK.
    const entries = await fs.readFile(LOG);

    if(entries){
	fs.writeFile(`/home/nonay/ip-blocker/last.log`, entries, {flag: "a+"});
	console.log("Se ha sumado el log al backup")
    }
    fs.writeFile(LOG, "");

    console.log("Se ha limpiado el log");
}
