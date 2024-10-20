import { connect } from '../config.js';

export class DBReviewBans {
    static async GetAllBans(){
        const [ result ] = await connect.query(
            "SELECT * FROM Baneos"
        )

        return result
    }
}