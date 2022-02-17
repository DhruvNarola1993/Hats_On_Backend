const loginHelper = require('../helper/login.helper');
const { socialLoginUser, customLoginUser, logoutService, updatepasswordUser, sendOtpForUpdate } = require('../services/login.service');
const { checkLoginPassword } = require('../validations/login.validator');
const { checkPassword } = require('../validations/register.validator');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const loginUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { issocial } = payload;
            payload.connectionid = socket.id;
            payload.online = true;
            if (issocial) {
                const { email } = payload;
                var errorMsg = await loginHelper.socialLoginValidator(payload);
                if (errorMsg.status) {
                    errorMsg = await socialLoginUser(payload);
                    _common.sendMsgToUser(socket, "res:login", errorMsg);
                } else {
                    _common.sendMsgToUser(socket, "res:login", errorMsg);
                    return;
                }
            } else if (!issocial) {
                const { mobile, password } = payload;
                var errorMsgCustom = await loginHelper.customLoginValidator(payload);
                if (errorMsgCustom.status) {
                    errorMsgCustom = await customLoginUser(payload);
                    _common.sendMsgToUser(socket, "res:login", errorMsgCustom);
                } else {
                    _common.sendMsgToUser(socket, "res:login", errorMsgCustom);
                    return;
                }
            } else {
                // Error
                _common.sendMsgToUser(socket, "res:login", {});
                return;
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:login", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:login", loginUser);

    // logout user
    const logoutUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload;
            payload.connectionid = "";
            payload.online = true;
            errorMsgCustom = await logoutService(payload);
            _common.sendMsgToUser(socket, "res:logout", errorMsgCustom);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:logout", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:logout", logoutUser);


    /**
     * 
     * Update Password
     * 
     */
    const updatePassword = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, otp, password } = payload;
            var errorMsgPassword = await checkPassword(password);
            if (errorMsgPassword.status) {
                var errorUpdate = await updatepasswordUser(payload);
                _common.sendMsgToUser(socket, "res:updatepassword", errorUpdate);
            } else {
                _common.sendMsgToUser(socket, "res:updatepassword", errorMsgPassword);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:updatepassword", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:updatepassword", updatePassword);



    /**
     * 
     * Send OTP Update Password
     * 
     */
    const sendotpForPassword = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            var send = await sendOtpForUpdate(payload);
            _common.sendMsgToUser(socket, "res:sendOtpForUpdatePassword", send);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:sendOtpForUpdatePassword", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:sendOtpForUpdatePassword", sendotpForPassword);

    return {
        loginUser,
        logoutUser,
        sendotpForPassword,
        updatePassword
    };
};