var registerValidator = require('../validations/register.validator');
var contactusValidator = require('../validations/contactus.validator');

async function contactValidator(payload) {
    try {
        // mobile, password
        const { mobile, email, name, query } = payload;
        var errorMsgName = await contactusValidator.checkName(name);
        var errorMsgEmail = await registerValidator.checkEmail(email);
        var errorMsgMobile = await registerValidator.checkMobile(mobile);
        var errorMsgQuery = await contactusValidator.checkQuery(query);
        if (errorMsgMobile.status && errorMsgEmail.status && errorMsgName.status && errorMsgQuery.status) {
            return errorMsgMobile && errorMsgEmail && errorMsgName && errorMsgQuery;
        } else {
            if (!errorMsgName.status)
                return errorMsgName;    
            else if (!errorMsgEmail.status)
                return errorMsgEmail;
            else if (!errorMsgMobile.status)
                return errorMsgMobile;
            else if (!errorMsgQuery.status)
                return errorMsgQuery;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Error"
        };
    }
}

module.exports = { contactValidator };
