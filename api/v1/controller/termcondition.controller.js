const { listAllTerm } = require('../services/termcondition.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const termforUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await listAllTerm(payload);
            _common.sendMsgToUser(socket, "res:term", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:term", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:term", termforUser);
    return {
        termforUser
    };
};