const { listAllRating } = require('../services/rating.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const ratingforUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await listAllRating(payload);
            _common.sendMsgToUser(socket, "res:ratinglevel", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:ratinglevel", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:ratinglevel", ratingforUser);
    return {
        ratingforUser
    };
};