import { DBJudge } from "../models/DBJudge.js";

export async function JudgeBehavior(){
    const peticiones = await DBJudge.GetAll();

    // console.log(peticiones);
}