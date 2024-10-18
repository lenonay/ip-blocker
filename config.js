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
    ".env"
]