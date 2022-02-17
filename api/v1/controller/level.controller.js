const { listAllLevel } = require('../services/level.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const levelforUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await listAllLevel(payload);
            _common.sendMsgToUser(socket, "res:level", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:level", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:level", levelforUser);
    return {
        levelforUser
    };
};