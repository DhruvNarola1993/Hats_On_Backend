const tournamentHelper = require('../helper/tournament.common.helper');

module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const tournamentList = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentHelper.tournamentlistValidator(payload);
            _common.sendMsgToUser(socket, "res:listoftournament", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:listoftournament", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:listoftournament", tournamentList);

    const tournamentRegister = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentHelper.tournamentregisterValidator(payload);
            _common.sendMsgToUser(socket, "res:registertournament", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:registertournament", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:registertournament", tournamentRegister);
    
    const tournamentRound = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentHelper.tournamentroundValidator(payload);
            _common.sendMsgToUser(socket, "res:tournamentround", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:tournamentround", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:tournamentround", tournamentRound);

    const tournamentplayRound = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            payload.connectionid = socket.id;
            var errorMsg = await tournamentHelper.tournamentplayroundValidator(payload);
            _common.sendMsgToUser(socket, "res:playRoundForTournament", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:playRoundForTournament", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:playRoundForTournament", tournamentplayRound);

    const tournamentexitRound = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentHelper.tournamentexitroundValidator(payload);
            _common.sendMsgToUser(socket, "res:exitRoundForTournament", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:exitRoundForTournament", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:exitRoundForTournament", tournamentexitRound);

    const tournamentwinRound = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentHelper.tournamentwinroundValidator(payload);
            _common.sendMsgToUser(socket, "res:winRoundForTournament", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:winRoundForTournament", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:winRoundForTournament", tournamentwinRound);

    const tournamentexitroundafterplayRound = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await tournamentHelper.tournamentexitroundafterplayroundValidator(payload);
            _common.sendMsgToUser(socket, "res:exitRoundAfterPlayRoundForTournament", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:exitRoundAfterPlayRoundForTournament", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:exitRoundAfterPlayRoundForTournament", tournamentexitroundafterplayRound);

    
    return {
        tournamentList,
        tournamentRegister,
        tournamentRound,
        tournamentplayRound,
        tournamentexitRound,
        tournamentwinRound,
        tournamentexitroundafterplayRound
    };
};