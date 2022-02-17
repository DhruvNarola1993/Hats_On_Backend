var Message = require('../models/message.model');

async function messageCode(params) {
    try {
        const code = params;
        var findMessage = await Message.findOne({ uniquecode: code }).select({ _id: 0, message: 1 }).lean();
        if (findMessage != null) {
            return findMessage.message;
        } else {
            return "Code is not find";
        }

    } catch (error) {
        return error;
    }
}

module.exports = { messageCode };