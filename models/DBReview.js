import { exec } from "node:child_process";
import { connect } from '../config.js';

export class DBReviewBans {
    static async GetAllBans(){
        // Recuperamos todos los bans de la base de datos
        const [ result ] = await connect.query(
            "SELECT * FROM Baneos"
        )
        // Los devolvemos
        return result
    }

    static async ReviewBan(ban){
        const { ip, unban_time } = ban
    
        // Creamos un objeto Date y recuperamos el time.
        const current_time = new Date().getTime();

        // Recuperamos el time desde la base datos
        const ban_time = new Date(unban_time).getTime();

        // Si aun queda ban por delante, nos salimos
        if (ban_time > current_time){
            return;
        }

        // Lo sacamos del firewall
        const comando = `ufw delete deny from ${ip}`;
        exec(comando, (error) => { if(error) console.log(error); });

        // Lo quitamos de la DB.
        await connect.query(
            "DELETE FROM Baneos WHERE ip = ?",
            [ ip ]
        );
    }
}