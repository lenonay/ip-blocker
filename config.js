import { configDotenv } from "dotenv";
import mysql2 from "mysql2/promise";

configDotenv()

export const {
    LOG,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASS
} = process.env;

// 
export const connect = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB
});

export const FORBIDEN_URI = [
    ".env", "cgi-bin/luci/;stok=/locale",
    "../../../", "/cgi-bin/.%2e/",
    "\x16", "*",
    "robots.txt", "webui/",
    "Gh0st", "cloudflare",
    "shell", "web-console",
    "wp"
]

// User agents que son usados en scrappers entre otras cosas
export const FORBIDEN_USER_AGENT = [
    "python", "Palo Alto Networks company",
    "-", "InternetMeasurement",
    "Googlebot", "Go-http-client",
    "Keydrop", "zgrab",
    "Odin", "CensysInspect",
    "Custom-AsyncHttpClient", "TheInternetSearchx",
    "curl"
]