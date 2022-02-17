const { listAllFAQ } = require('../services/faq.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const faqforUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var errorMsg = await listAllFAQ(payload);
            _common.sendMsgToUser(socket, "res:faq", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:faq", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:faq", faqforUser);
    return {
        faqforUser
    };
};