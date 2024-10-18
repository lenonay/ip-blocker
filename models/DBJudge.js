import mysql2 from "mysql2/promise";
import { DB, DB_HOST, DB_USER, DB_PASS, FORBIDEN_URI, FORBIDEN_USER_AGENT } from "../config.js";

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

    static async JudgeEntry(entry) {
        // Inciamos el contador de peligro
        let peligro = 0;

        // Sacamos la información que necesitamos
        const { ip, method, status, uri, user_agent } = entry;

        // Validamos el metodo
        if (method !== "POST" && method !== "GET") {
            // Si es un método inusual sumamos 1 punto de peligro
            peligro += 2;
        }

        // Validamos el method
        switch(true){
            case status == 400:
                peligro += 4;
            break;

            case status == 404:
                peligro += 4;
            break;

            case status < 500 && status > 400:
                peligro += 1;
            break;
        }

        // Validamos que la uri no tenga parametros prohibidos
        if (FORBIDEN_URI.some( (url) => uri.includes(url))){
            peligro += 3;
        }

        // Validamos el user agent
        if (FORBIDEN_USER_AGENT.some( agents => user_agent.includes(agents))){
            peligro += 10;
        }
    
        // Si peligro es mayor 1, contamos la peticion como maliciosa.
        const malicioso = (peligro > 0) ? 1 : 0;

        const [ result ] = await connect.query(
            "UPDATE IPs SET peligro = peligro + ?, malicious_count = malicious_count + ? WHERE ip LIKE ? ",
            [peligro, malicioso, ip]
        );
    }
}