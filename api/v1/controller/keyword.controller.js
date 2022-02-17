const { listAllKeyword } = require('../services/keyword.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const keywordforUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await listAllKeyword(payload);
            _common.sendMsgToUser(socket, "res:keyword", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:keyword", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:keyword", keywordforUser);
    return {
        keywordforUser
    };
};