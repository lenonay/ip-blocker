import { DBJudge } from "../models/DBJudge.js";

export async function JudgeBehavior(){
    const peticiones = await DBJudge.GetAll();

    for(const peticion of peticiones){
        DBJudge.JudgeEntry(peticion);
    }
}