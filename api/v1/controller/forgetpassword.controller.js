const forgetPasswordHalper = require('../helper/forgetpassword.helper');
const { sendOtp, resetpasswordUser, mobileCountUser } = require('../services/register.service');
module.exports = async (io, socket) => {
    const forgetpasswordUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, otp } = payload;
            var errorMsg = await forgetPasswordHalper.forgetValidator(payload);
            if (errorMsg.status) {
                var errorMsg = await mobileCountUser(payload);
                if (errorMsg.status == true) {
                    errorMsg = await sendOtp(payload);
                    _common.sendMsgToUser(socket, "res:forgetpassword", errorMsg);
                    return;
                } else {
                    _common.sendMsgToUser(socket, "res:forgetpassword", errorMsg);
                }
            } else {
                _common.sendMsgToUser(socket, "res:forgetpassword", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:forgetpassword", {
                status: false,
                msg: error
            });
        }
    };

    const resetpassUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, password } = payload;
            var errorMsg = await forgetPasswordHalper.forgetPasswordValidator(payload);
            if (errorMsg.status == true) {
                errorMsg = await resetpasswordUser(payload);
                // //console.log(errorMsg);
                _common.sendMsgToUser(socket, "res:resetpassword", errorMsg);
                return;
            } else {
                _common.sendMsgToUser(socket, "res:resetpassword", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:resetpassword", {
                status: false,
                msg: error
            });
        }
    };

    socket.on("req:forgetpassword", forgetpasswordUser); // Forget Password
    socket.on("req:resetpassword", resetpassUser);  // Reset Password and Update Password
    return {
        forgetpasswordUser,
        resetpassUser
    };
};