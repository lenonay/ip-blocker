import mysql2 from "mysql2/promise";
import { exit } from "node:process";
import { config } from "dotenv";

config({ path: "./.env" });
// Validamos la ruta del config 
if(!process.env.LOG){
    console.error("No se encontró el fichero {.env}, es necesario que contenga los parametros adecuados");
    console.log("Ruta actual de trabajo:",process.cwd());
    console.log("Mueve el fichero a esta ruta desde donde ejectua el programa",
        "o pone el la ruta absoulta en el configDotenv() en el fichero config.js"
    );
    exit(1);
}

//  Parametros del .env
export const {
    LOG,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASS
} = process.env;

// Exportamos la conexión a la DB
export const connect = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB
});

// Listado de URL prohibidas
export const FORBIDEN_URI = [
    ".env", "cgi-bin/luci/;stok=/locale",
    "../../../", "/cgi-bin/.%2e/",
    "\x16", "*",
    "robots.txt", "webui/",
    "Gh0st", "cloudflare",
    "shell", "web-console",
    "wp"
]

// User agents prohibidos, que son usados en scrappers entre otras cosas
export const FORBIDEN_USER_AGENT = [
    "python", "Palo Alto Networks company",
    "-", "InternetMeasurement",
    "Googlebot", "Go-http-client",
    "Keydrop", "zgrab",
    "Odin", "CensysInspect",
    "Custom-AsyncHttpClient", "TheInternetSearchx",
    "curl", "",
    " "
]