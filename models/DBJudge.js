import mysql2 from "mysql2/promise";
import { exec, execSync } from "node:child_process";
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
        switch (true) {
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
        if (FORBIDEN_URI.some((url) => uri.includes(url))) {
            peligro += 3;
        }

        // Validamos el user agent
        if (FORBIDEN_USER_AGENT.some(agents => user_agent.includes(agents))) {
            peligro += 10;
        }

        // Si peligro es mayor 1, contamos la peticion como maliciosa.
        const malicioso = (peligro > 0) ? 1 : 0;

        await connect.query(
            "UPDATE IPs SET peligro = peligro + ?, malicious_count = malicious_count + ? WHERE ip LIKE ? ",
            [peligro, malicioso, ip]
        );
    }

    static async GetIPsInfo() {
        const [result] = await connect.query("SELECT * FROM IPs");

        return result;
    }

    static async JudgeBehavior(info) {
        const { ip, peligro, baneos, is_banned } = info;
        // Si ya está baneado lo dejamos
        if (is_banned === "true") return

        let ban_level = 0;

        // Creamos el nivel de baneo
        switch (true) {
            case peligro > 10 && peligro <= 30:
                ban_level = 1;
                break;

            case peligro > 31 && peligro <= 50:
                ban_level = 2;
                break;

            case peligro > 51 && peligro <= 70:
                ban_level = 3;
                break;

            case peligro > 71:
                ban_level = 4;
                break;
        }

        // Si el nivel es 0 nos salimos
        if (ban_level === 0) {
            return;
        }

        // Equivalencias entre niveles y horas baneadas
        const bans = {
            0: null,
            1: 1,
            2: 4,
            3: 24,
            4: 0
        }

        // Obtenemos cuantos ms estará baneado
        const ban_time = (bans[(ban_level + baneos)]) * 60 * 60 * 1000;

        // Obtenemos la fecha actual
        const current_time = new Date();

        // Obtenemos otra fecha
        const unban_time = new Date();

        // Cambiamos la fecha a la acutal + las horas baneadas
        unban_time.setTime(current_time.getTime() + ban_time);

        // Metemos al Firewall
        const addRule = `sudo ufw deny from ${ip}`;
        execSync(addRule, (error) => { if (error) console.log(error);});

        // Metemos el baneo a la tabla
        await connect.query(
            "INSERT INTO Baneos(ip, ban_level, time, unban_time) VALUES (?,?,?,?)",
            [ ip, ban_level, current_time.toISOString(), unban_time.toISOString() ]
        );

        // Reinciamos el conteo de peligro y aumentamos en 1 los baneos 
        await connect.query(
            "UPDATE IPs SET peligro = 0,baneos = baneos + 1, last_ban = ?, is_banned = ? WHERE ip = ?",
            [current_time.toISOString(), "true", ip]
        );
    }
}