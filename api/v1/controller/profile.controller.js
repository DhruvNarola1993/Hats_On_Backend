const  profileHelper  = require('../helper/profile.helper');
const { updateProfile } = require('../services/profile.service');

module.exports = async (io, socket) => {
    const profile = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, name, lastname, email, gender, dateofbirth } = payload;
            var errorMsg = await profileHelper.profileUpdateValidator(payload);
            if (errorMsg.status == true) {
                errorMsg = await updateProfile(payload);
                _common.sendMsgToUser(socket, "res:profile", errorMsg);
            } else {
                _common.sendMsgToUser(socket, "res:profile", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:profile", {
                status: false,
                msg: error
            });
        }
    };
  
    socket.on("req:profile", profile);
    
    return {
        profile
    };
};