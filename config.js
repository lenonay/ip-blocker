import { configDotenv } from "dotenv";

configDotenv()

export const {
    LOG,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASS
} = process.env;

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