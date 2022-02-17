const lobbyHelper = require('../helper/lobby.helper');

module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const createRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload;
            payload.connectionid = socket.id;
            payload.createdate = new Date();
            var errorMsg = await lobbyHelper.isInitRoomValidator(payload);
            if (errorMsg != undefined && errorMsg != null)
                if (!(errorMsg.status))
                    _common.sendMsgToUser(socket, "res:roomname", errorMsg);
        } catch (error) {
            // Error
            //console.log("Main Error , " + error);
            _common.sendMsgToUser(socket, "res:roomname", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:roomname", createRoom);

    // //console.log(socket.id);
    const createRoomBySelectPlayer = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await lobbyHelper.isAferForCriticalTimeValidator(payload);
            if (errorMsg != undefined && errorMsg != null)
                if (!(errorMsg.status))
                    _common.sendMsgToUser(socket, "res:playselectplayer", errorMsg);
        } catch (error) {
            // Error
            //console.log("Main Error , " + error);
            _common.sendMsgToUser(socket, "res:playselectplayer", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:playselectplayer", createRoomBySelectPlayer);

    // Exit Player in Lobby
    const exitPlayerLobby = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await lobbyHelper.exitTimeValidator(payload);
            _common.sendMsgToUser(socket, "res:exitwaittime", errorMsg);
        } catch (error) {
            // Error
            //console.log("Main Error , " + error);
            _common.sendMsgToUser(socket, "res:exitwaittime", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:exitwaittime", exitPlayerLobby);


    // Win Player in Multiplayer
    const winmultiplayerGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await lobbyHelper.multiplayerwingame(payload);
            _common.sendMsgToUser(socket, "res:MultiplayerVer_GameFinish", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:MultiplayerVer_GameFinish", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:MultiplayerVer_GameFinish", winmultiplayerGame);

    // Return Point or coin in Multiplayer
    const returncoinpointGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await lobbyHelper.returncoinpoint(payload);
            _common.sendMsgToUser(socket, "res:ReturnPointOrCoins", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:ReturnPointOrCoins", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:ReturnPointOrCoins", returncoinpointGame);

    // Ads Version Point for Multiplayer
    const adsvesionaddpointGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await lobbyHelper.adsvesionaddpoint(payload);
            _common.sendMsgToUser(socket, "res:AdsVer_EarnHPoint", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:AdsVer_EarnHPoint", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:AdsVer_EarnHPoint", adsvesionaddpointGame);

     // Restart Point or coin in Multiplayer, Play with friend
     const restartcoinpointGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await lobbyHelper.restartcoinpoint(payload);
            _common.sendMsgToUser(socket, "res:RestartPointOrCoins", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:RestartPointOrCoins", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:RestartPointOrCoins", restartcoinpointGame);

    return {
        createRoom,
        createRoomBySelectPlayer,
        exitPlayerLobby,
        winmultiplayerGame,
        returncoinpointGame,
        adsvesionaddpointGame,
        restartcoinpointGame
    };
};