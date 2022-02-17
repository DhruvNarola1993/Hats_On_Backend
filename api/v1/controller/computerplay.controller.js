const computerenterHelper = require('../helper/computerplay.helper');

module.exports = async (io, socket) => {
    // Computer Version Play game 
    const entercomputerGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await computerenterHelper.computerversionentergame(payload);
            _common.sendMsgToUser(socket, "res:ComputerVer_EnterGame", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:ComputerVer_EnterGame", {
                status: false,
                msg: error
            });
        }
    };

    // Computer Version Win game
    const wincomputerGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await computerenterHelper.computerversionwingame(payload);
            _common.sendMsgToUser(socket, "res:ComputerVer_GameFinish", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:ComputerVer_GameFinish", {
                status: false,
                msg: error
            });
        }
    };

     // Computer Version Ads Coin
    const adscoinGame = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await computerenterHelper.computerversionadscoin(payload);
            _common.sendMsgToUser(socket, "res:ComputerVer_EarnCoins", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:ComputerVer_EarnCoins", {
                status: false,
                msg: error
            });
        }
    };


    socket.on("req:ComputerVer_EnterGame", entercomputerGame);  // Computer Version Play game 
    socket.on("req:ComputerVer_GameFinish", wincomputerGame);  // Computer Version Win game 
    socket.on("req:ComputerVer_EarnCoins", adscoinGame);  // Computer Version Ads Coin
    return {
        entercomputerGame,
        wincomputerGame,
        adscoinGame
    };
};