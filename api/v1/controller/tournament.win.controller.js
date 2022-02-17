const { tournamentwinerService } = require('../services/tournament.service');

module.exports = async (io, socket) => {
    const tournamentWinList = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentwinerService(payload);
            _common.sendMsgToUser(socket, "res:listofwintournamentuser", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:listofwintournamentuser", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:listofwintournamentuser", tournamentWinList);
    return {
        tournamentWinList
    };
};