const { listAllHowToPlay } = require('../services/howtoplay.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const howtoplayforUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await listAllHowToPlay(payload);
            _common.sendMsgToUser(socket, "res:howtoplay", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:howtoplay", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:howtoplay", howtoplayforUser);
    return {
        howtoplayforUser
    };
};