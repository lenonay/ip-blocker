import { DBJudge } from "../models/DBJudge.js";

export async function JudgeBehavior(){
    // Obtener todas las personas
    const peticiones = await DBJudge.GetAll();

    // Iteramos por cada peticion
    for(const peticion of peticiones){
        DBJudge.JudgeEntry(peticion);
    }

    // Obtener IPs info
    const AllInfo = await DBJudge.GetIPsInfo();

    for(const info of AllInfo){
        await DBJudge.JudgeBehavior(info);
    }
}