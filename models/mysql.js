import mysql2 from "mysql2/promise";
import { DB, DB_HOST, DB_USER, DB_PASS } from "../config.js";

const connect = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB
});

export class MySQL {
    static async Verify() {
        // Creamos las queries que vayamos a ejecutar
        const queries = [
            "SELECT * FROM IPs LIMIT 1",
            "SELECT * FROM Peticiones LIMIT 1"
        ];

        // Inicializamos el contador de tests
        let tests = [];

        // Iteramos las queries
        queries.forEach(async query =>{
            // Recuperamos la info de la tabla
            const [ , info ] = await connect.query(query);

            // Si no está vacía metemos true
            if(info !== null){
                tests.push(true);
            // En caso contrario metemos false
            }else {
                tests.push(false);
            }
        });

        // Validamos que hayan pasado todos los tests
        if(tests.every((val) => val = true)){
            return true;
        }else{
            return false;
        }
    }
}