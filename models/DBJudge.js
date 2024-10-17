import mysql2 from "mysql2/promise";
import { DB, DB_HOST, DB_USER, DB_PASS } from "../config.js";

const connect = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB
});

export class DBJudge {
    static async GetAll(){
        const result = await connect.query("SELECT * FROM Peticiones");

        console.log(result)
    }
}