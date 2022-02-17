var registerValidator = require('../validations/register.validator');
var loginValidator = require('../validations/login.validator');
const { notEmptyAndNull } = require('../common/common.validator');

async function socialLoginValidator(payload) {
    try {
        // email, mobile
        const { userid } = payload;
        var errorMsgEmail = await notEmptyAndNull(userid);
        // var errorMsgMobile = await registerValidator.checkMobile(mobile);
        if (errorMsgEmail.status) {
            return errorMsgEmail;
        } else {
            if(!errorMsgEmail.status)
                return errorMsgEmail;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function customLoginValidator(payload) {
    try {
        // password
        const { mobile } = payload;
        var errorMsgMobile = await registerValidator.checkMobile(mobile);
        // var errorMsgPassword = await loginValidator.checkLoginPassword(password);
        if (errorMsgMobile.status) {
            return errorMsgMobile;
        } else {
            if(!errorMsgMobile.status)
                return errorMsgMobile;
            // else if (!errorMsgPassword.status)
            //     return errorMsgPassword;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function socialLoginValidator(payload) {
    try {
        // email, mobile
        const { userid } = payload;
        var errorMsgEmail = await notEmptyAndNull(userid);
        // var errorMsgMobile = await registerValidator.checkMobile(mobile);
        if (errorMsgEmail.status) {
            return errorMsgEmail;
        } else {
            if(!errorMsgEmail.status)
                return errorMsgEmail;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}



module.exports = { socialLoginValidator, customLoginValidator };