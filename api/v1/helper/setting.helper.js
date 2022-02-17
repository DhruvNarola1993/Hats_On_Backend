var registerValidator = require('../validations/register.validator');
var usersettingValidator = require('../validations/setting.validator');

async function settingValidator(payload) {
    try {
        // mobile, key, value
        const { mobile, key, value } = payload;
        var errorMsgMobile = await registerValidator.checkMobile(mobile);
        var errorMsgkeyValue = await usersettingValidator.checkKey(payload);
        if (errorMsgMobile.status && errorMsgkeyValue.status) {
            return errorMsgMobile && errorMsgkeyValue;
        } else {
            if(!errorMsgMobile.status)
                return errorMsgMobile;
            else if (!errorMsgkeyValue.status)
                return errorMsgkeyValue;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { settingValidator };