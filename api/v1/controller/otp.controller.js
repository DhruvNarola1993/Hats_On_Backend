const { verifyOtp } = require('../services/register.service');
module.exports = async (io, socket) => {
    const otpVerifyUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, otp } = payload;
            var errorMsg = await verifyOtp(payload);
            _common.sendMsgToUser(socket, "res:verifyotp", errorMsg);
            return;
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:verifyotp", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:verifyotp", otpVerifyUser);
    return {
        otpVerifyUser
    };
};