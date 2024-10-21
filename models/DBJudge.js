import { execSync } from "node:child_process";
import { connect, FORBIDEN_URI, FORBIDEN_USER_AGENT } from "../config.js";


export class DBJudge {
    static async GetAll() {
        // Obtenemos todas las peticiones
        const [result] = await connect.query("SELECT * FROM Peticiones");

        // Las devolvemos en bruto
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
            // Si recibimos un 400 +4 pto
            case status == 400:
                peligro += 4;
                break;

            // Si recibimos un 404 +2 pto
            case status == 404:
                peligro += 2;
                break;
            // Cualquier error 4** +1 pto
            case status < 500 && status > 400:
                peligro += 1;
                break;
        }

        // Validamos que la uri no tenga parametros prohibidos
        if (FORBIDEN_URI.some((url) => uri.includes(url))) {
            // Si los tiene +3 pto
            peligro += 3;
        }

        // Validamos el user agent
        if (FORBIDEN_USER_AGENT.some(agents => user_agent.includes(agents))) {
            // Si lo tiene +10 pto
            peligro += 10;
        }

        // Si peligro es mayor 1, contamos la peticion como maliciosa.
        const malicioso = (peligro > 0) ? 1 : 0;

        // Actualizamos los valores de peligro y sumamos una petición maliciosa al contador
        await connect.query(
            "UPDATE IPs SET peligro = peligro + ?, malicious_count = malicious_count + ? WHERE ip LIKE ? ",
            [peligro, malicioso, ip]
        );
    }

    static async GetIPsInfo() {
        // Obtenemos toda la información de las IPs
        const [result] = await connect.query("SELECT * FROM IPs");

        // Las devolvemos
        return result;
    }

    static async JudgeBehavior(info) {
        // Sacamos los parametros necesarios
        const { ip, peligro, baneos, is_banned } = info;
        // Si ya está baneado salimos
        if (is_banned === "true") return

        // Inicializamos el nivel de ban
        let ban_level = 0;

        // Creamos el nivel de baneo en funcion a la cantidad de peligro de esa IP
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

            case peligro > 71 && peligro <= 100:
                ban_level = 4;
                break;
            case peligro > 101 && peligro <= 130:
                ban_level = 5;
                break;
            case peligro > 131:
                ban_level = 6;
                break;
        }

        // Si el nivel es 0 nos salimos
        if (ban_level === 0) {
            return;
        }

        // Equivalencias entre niveles y horas baneadas
        const bans = {
            1: 1,
            2: 4,
            3: 8,
            4: 16,
            5: 24
        }

        // Formula para calcular los niveles superiores
        const calculate_bantime = lvl => { return Math.pow(2, lvl) * 60 * 60 * 1000 }

        // Obtenemos cuantos ms estará baneado
        const real_ban_level = ban_level + baneos;

        let ban_time = (real_ban_level <= 5) 
            // Si es menor o igual a 5
            ? bans[real_ban_level] * 60 * 60 * 1000
            // Si es mayor calculamos el nuevo valor
            : calculate_bantime(real_ban_level);

        console.log(ip, ban_time);

        // Obtenemos la fecha actual
        const current_time = new Date();

        // Obtenemos otra fecha
        const unban_time = new Date();

        // Cambiamos la fecha a la acutal + las horas baneadas
        unban_time.setTime(current_time.getTime() + ban_time);

        // Metemos al Firewall
        const addRule = `sudo ufw deny from ${ip}`;
        execSync(addRule, (error) => { if (error) console.log(error); });

        console.log(ip, ban_time, unban_time, current_time);

        // Metemos el baneo a la tabla
        await connect.query(
            "INSERT INTO Baneos(ip, ban_level, time, unban_time) VALUES (?,?,?,?)",
            [ip, ban_level, current_time, unban_time]
        );

        // Reinciamos el conteo de peligro y aumentamos en 1 los baneos 
        await connect.query(
            "UPDATE IPs SET peligro = 0,baneos = baneos + 1, last_ban = ?, is_banned = ? WHERE ip = ?",
            [current_time, "true", ip]
        );
    }
}