import fs from "node:fs/promises"

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
            return true;
        } else {
            // Si no se han pasado devolvemos fasle
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
            status_unf, req_bytes_unf,
            , ...user_agent_unf
        ] = entry

        //  Quitamos la " delante del metodo
        let method = (method_unf) ? method_unf.slice(1) : "NULL";
        // Quitamos la " al final de la version
        let version = (version_unf) ? version_unf.slice(0, -1) : "NULL"
        // Unimos todos los elementos restantes que forman el user agent
        const user_agent = user_agent_unf.join(" ");
        // Unimos la hora con la zona horaria
        const timestamp_unf = time + utc;
        
        // Formateamos la fecha a ISO
        const timestamp = (isNaN(timestamp_unf)) ? new Date().toISOString() : Formater(timestamp_unf);

        // Validamos el tamaño del método
        if (method.length > 20){
            method = method.slice(0, 19);
        }

        // Validamos el tamaño de la version
        if (version.length > 10){
            version = version.slice(0, 9);
        }

        // Validamos que req_bytes sea un numero, si lo es asignamos ese valor, sino 0
        let req_bytes = (isNaN(req_bytes_unf)) ? 0 : req_bytes_unf;

        // Validamos que el codigo de estado no este vacio
        let status = (!status_unf) ? 400 : status_unf;
        // Validamos que sea un numero
        status = (isNaN(status_unf)) ? 400 : status_unf;

        // Metemos la IP a las tabla de IPs
        await AddIPtoDB(ip);

        // Metemos la peticion a la tabla
        try {

            await connect.query(
                "INSERT INTO Peticiones(ip, method, uri, version, status, req_bytes, user_agent, timestamp) VALUES (?,?,?,?,?,?,?,?)",
                [ip, method, uri, version, status, req_bytes, user_agent, timestamp]
            );
        } catch (e){
            console.log("Error al meter un registro");

            // Metemos el error a la tabla
            fs.writeFile(
                "./errores.txt",
                `IP=${ip}|Error=${e}\n`,
            { flag: "a+"}
            );

            
            // Le metemos +20 de peligro a esa IP si existe
            if(ip){
                await connect.query(
                    "UPDATE IPs SET peligro = peligro + ? WHERE ip = ?",
                    [20, ip]
                );
                console.log("Añadido 20 puntos de peligro a",ip);
            }

        }

    }
}

async function AddIPtoDB(ip) {
    // Buscamos la IP en la DB para ver si ya está
    const [result] = await connect.query("SELECT * FROM IPs WHERE ip LIKE ?", ip);

    //  Si no está en la db la metemos
    if (!result.length) {
        try {
            await connect.query("INSERT INTO IPs(ip) VALUES (?)", ip);
        } catch {
            console.log("Error al meter la ip a la tabla");
        }
    }
}