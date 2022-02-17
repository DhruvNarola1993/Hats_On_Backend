const settingHelper = require('../helper/setting.helper');
const { updateSetting } = require('../services/setting.service');
module.exports = async (io, socket) => {
    // //console.log(socket.id);
    const settingUser = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, key, value } = payload;
            var errorMsg = await settingHelper.settingValidator(payload);
            if (errorMsg.status == true) {
                errorMsg = await updateSetting(payload);
                _common.sendMsgToUser(socket, "res:setting", errorMsg);
            } else {
                _common.sendMsgToUser(socket, "res:setting", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:setting", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:setting", settingUser);
    return {
        settingUser
    };
};