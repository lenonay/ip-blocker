import mysql2 from "mysql2/promise";
import { DB, DB_HOST, DB_USER, DB_PASS, FORBIDEN_URI } from "../config.js";

const connect = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB
});

export class DBJudge {
    static async GetAll() {
        const [result] = await connect.query("SELECT * FROM Peticiones");

        return result;
    }

    static JudgeEntry(entry) {
        // Inciamos el contador de peligro
        let peligro = 0;

        // Sacamos la información que necesitamos
        const { method, status, uri, user_agent } = entry;

        // Validamos el metodo
        if (method !== "POST" || method !== "GET") {
            // Si es un método inusual sumamos 1 punto de peligro
            peligro += 1;
        }

        // Validamos que la uri no tenga parametros prohibidos
        if (FORBIDEN_URI.some( (url) => uri.includes(url))){
            peligro += 3
        }
    
        
    }
}