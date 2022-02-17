const registerHelper = require('../helper/register.helper');
const { socialCountUser, customCountUser, saveUser } = require('../services/register.service');
const { socialLoginUser } = require('../services/login.service');
module.exports = async (io, socket) => {
    //console.log(socket.id);
    const createUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, referencecode, issocial, devicetype } = payload;
            payload.connectionid = socket.id;
            payload.registerdate = new Date();
         
            if (issocial) {
                const { email, profilepic, name, logintype } = payload;
                errorMsg = await registerHelper.socialValidator(payload);
                if (errorMsg.status == false) {
                    // Error
                    _common.sendMsgToUser(socket, "res:register", errorMsg);
                    return;
                } else if (errorMsg.status) {
                    // //console.log(payload);
                    errorMsg = await socialCountUser(payload);
                    // console.log(errorMsg)
                    if (errorMsg.status) {
                        var insertUser = await saveUser(payload);
                        // Insert error and return
                        _common.sendMsgToUser(socket, "res:register", insertUser);
                        return;
                    } else {
                        // Error
                        _common.sendMsgToUser(socket, "res:register", errorMsg);
                        return;
                    }
                }
            } else if (!issocial) {
                const { password } = payload;
                errorMsg = await registerHelper.customValidator(payload);
                if (errorMsg.status == false) {
                    // Error
                    _common.sendMsgToUser(socket, "res:register", errorMsg);
                    return;
                } else if (errorMsg.status == true) {
                    errorMsg = await customCountUser(payload);
                    if (errorMsg.status) {
                        var insertCustom = await saveUser(payload);
                        // Insert error and return
                        _common.sendMsgToUser(socket, "res:register", insertCustom);
                        return;
                    } else {
                        // Error
                        _common.sendMsgToUser(socket, "res:register", errorMsg);
                        return;
                    }
                }
            } else {
                // Error
                _common.sendMsgToUser(socket, "res:register", {});
                return;
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:register", {
                status: false,
                msg: "Please Try Again."
            });
        }
    };
    socket.on("req:register", createUser);
    return {
        createUser
    };
};