var registerValidator = require('../validations/register.validator');
var contactusValidator = require('../validations/contactus.validator');
var profileValidator = require('../validations/profile.validtor');

async function profileUpdateValidator(payload) {
    try {
        const { name, lastname, email, gender, dateofbirth } = payload;
        var errorMsgName = await contactusValidator.checkName(name);
        var errorMsgLastName = await contactusValidator.checkName(lastname);
        var errorMsgEmail = await registerValidator.checkEmail(email);
        var errorMsgGender = await profileValidator.checkGender(gender);
        var errorMsgDob = await profileValidator.checkDOB(dateofbirth);
        if (errorMsgLastName.status && errorMsgEmail.status && errorMsgName.status && errorMsgGender.status && errorMsgDob.status) {
            return errorMsgLastName && errorMsgEmail && errorMsgName && errorMsgGender && errorMsgDob;
        } else {
            if (!errorMsgName.status)
                return errorMsgName;    
            else if (!errorMsgLastName.status)
                return errorMsgLastName;
            else if (!errorMsgEmail.status)
                return errorMsgEmail;
            else if (!errorMsgGender.status)
                return errorMsgGender;
            else if (!errorMsgDob.status)
                return errorMsgDob;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { profileUpdateValidator };
