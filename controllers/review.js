import { DBReviewBans } from "../models/DBReview.js";

export async function ReviewBans(){
    // Obtener toda la tabla de baneos
    const bans = await DBReviewBans.GetAllBans();
}