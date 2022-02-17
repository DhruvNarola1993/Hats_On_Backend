var registerValidator = require('../validations/register.validator');

async function commonValidator(payload) {
    try {
        // mobile, devicetype
        const { mobile, devicetype } = payload;
        var errorMsgMobile = await registerValidator.checkMobile(mobile);
        var errorMsgDevicetype = await registerValidator.checkDevicetype(devicetype);
        if (errorMsgMobile.status && errorMsgDevicetype.status) {
            return errorMsgMobile && errorMsgDevicetype;
        } else {
            if (!errorMsgMobile.status)
                return errorMsgMobile;
            else if (!errorMsgDevicetype.status)
                return errorMsgDevicetype;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function socialValidator(payload) {
    try {
        // "email":"dipesh1008@gmail.com",
        // "username": "1245656187782",
        // "issocial":true,
        // "mobile": "9723073000",
        // "logintype":"FACEBOOK", 
        // "devicetype" :"IOS", 
        // "referncecode": ""
        const { email, logintype, mobile } = payload;
        // var errorMsgEmail = await registerValidator.checkEmail(email);
        var errorMobile = await registerValidator.checkMobile(mobile);
        var errorMsgLogintype = await registerValidator.checkLogintype(logintype);
        if (errorMobile.status && errorMsgLogintype.status) {
            return errorMobile && errorMsgLogintype;
        } else {
            if (!errorMobile.status)
                return errorMobile;
            else if (!errorMsgLogintype.status)
                return errorMsgLogintype;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function customValidator(payload) {
    try {
        // password
        const { password, mobile } = payload;
        var errorMsgPassword = await registerValidator.checkPassword(password);
        var errorMobile = await registerValidator.checkMobile(mobile);
        if (errorMsgPassword.status && errorMobile.status) {
            return errorMsgPassword && errorMobile;
        } else {
            if (!errorMobile.status)
                return errorMobile;
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

module.exports = { commonValidator, socialValidator, customValidator };