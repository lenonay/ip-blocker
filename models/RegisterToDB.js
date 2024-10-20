import { connect } from "../config.js";
import { Formater } from "../utils/date.js";

export class MySQL {
    static async Verify() {
        // Creamos las queries que vayamos a ejecutar
        const queries = [
            "SELECT * FROM IPs LIMIT 1",
            "SELECT * FROM Peticiones LIMIT 1",
            "SELECT * FROM Baneos LIMIT 1",
            "DELETE FROM Peticiones"
        ];

        // Inicializamos el contador de tests
        let tests = [];

        // Iteramos las queries
        for (const query of queries) {
            try {
                // Recuperamos la info de la tabla
                const [, info] = await connect.query(query);

                // Si no está vacía metemos true
                if (info !== null) {
                    tests.push(true);
                } else {
                    tests.push(false);
                }

            } catch (error) {
                console.error("Error en la consulta:", error.message);
                // Puedes decidir si quieres agregar false a tests o simplemente continuar
                tests.push(false); // O puedes omitir esta línea si prefieres no contar la consulta fallida
            }
        }

        // Validamos que hayan pasado todos los tests
        if (tests.every((val) => val === true)) {
            await connect.query("DELETE FROM IPs");
            console.log("Se ha vaciado la tabla IPs");

            await connect.query("DELETE FROM Baneos");
            console.log("Se ha vaciado la tabla de baneos");
            return true;
        } else {
            return false;
        }
    }

    static async ProccessEntry(entry) {
        // Deconstruimos el array para quedarnos con variables manejables
        const [
            ip, ,
            , time,
            utc, method_unf,
            uri, version_unf,
            status, req_bytes,
            , ...user_agent_unf
        ] = entry

        const method = method_unf.slice(1);
        const version = version_unf.slice(0, -1)
        const user_agent = user_agent_unf.join(" ");
        const timestamp_unf = time + utc;
        const timestamp = Formater(timestamp_unf);

        // Metemos la IP a las tabla de IPs
        await AddIPtoDB(ip);

        // Metemos la peticion a la tabla
        await connect.query(
            "INSERT INTO Peticiones(ip, method, uri, version, status, req_bytes, user_agent, timestamp) VALUES (?,?,?,?,?,?,?,?)",
            [ip, method, uri, version, status, req_bytes, user_agent, timestamp]
        );

    }
}

async function AddIPtoDB(ip) {
    const [result] = await connect.query("SELECT * FROM IPs WHERE ip LIKE ?", ip);

    //  Si no está en la db la metemos
    if (!result.length) {
        try {
            await connect.query("INSERT INTO IPs(ip) VALUES (?)", ip);
        } catch {

        }
    }
}