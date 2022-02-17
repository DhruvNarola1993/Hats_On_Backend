var WinUserTournamentSetByAdmin = require("../models/tournament.win.model");

// Win Round Tournament
/**
 * @deprecated 
*/
async function tournamentwinerService(params) {
    try {
        const {
            tournamenttype
        } = params;
        var listWinner = await WinUserTournamentSetByAdmin.find({ });
        return {
            status: true,
            listOfuserWinner: listWinner
        };
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

module.exports = { tournamentwinerService };