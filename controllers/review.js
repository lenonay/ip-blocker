import { DBReviewBans } from "../models/DBReview.js";

export async function ReviewBans(){
    // Obtener toda la tabla de baneos
    const bans = await DBReviewBans.GetAllBans();

    // Iteramos por baneo
    for(const ban of bans){
        // Revisamos si hay que eliminar algun ban
        await DBReviewBans.ReviewBan(ban);
    }
    
    console.log("Terminado!");

}