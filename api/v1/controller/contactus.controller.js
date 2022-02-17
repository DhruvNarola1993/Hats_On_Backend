const  contactHelper  = require('../helper/contactus.helper');
const { saveContact } = require('../services/contact.service');

module.exports = async (io, socket) => {
    const contactUs = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { mobile, email, query, name } = payload;
            var errorMsg = await contactHelper.contactValidator(payload);
            if (errorMsg.status == true) {
                
                errorMsg = await saveContact(payload);
                _common.sendMsgToUser(socket, "res:contactus", errorMsg);
                return;
            } else {
                _common.sendMsgToUser(socket, "res:contactus", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:contactus", {
                status: false,
                msg: error
            });
        }
    };
  
    socket.on("req:contactus", contactUs);
    
    return {
        contactUs
    };
};