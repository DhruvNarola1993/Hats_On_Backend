var registerValidator = require('../validations/register.validator');

async function forgetPasswordValidator(payload) {
    try {
        // mobile, password
        const { mobile, password } = payload;
        var errorMsgMobile = await registerValidator.checkMobile(mobile);
        var errorMsgPassword = await registerValidator.checkPassword(password);
        if (errorMsgMobile.status && errorMsgPassword.status) {
            return errorMsgMobile && errorMsgPassword;
        } else {
            if(!errorMsgMobile.status)
                return errorMsgMobile;
            else if (!errorMsgPassword.status)
                return errorMsgPassword;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function forgetValidator(payload) {
    try {
        // mobile, password
        const { mobile } = payload;
        var errorMsgMobile = await registerValidator.checkMobile(mobile);
        if (errorMsgMobile.status) {
            return errorMsgMobile;
        } else {
           return errorMsgMobile;
           
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { forgetPasswordValidator, forgetValidator };
