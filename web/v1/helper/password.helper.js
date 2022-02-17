var { isBoolean, isNumber, notEmptyAndNull, checkPassword } = require('../common/common.validator');
var { updatePassword, updatepasswordUser } = require('../services/password.service');
// Forget Password
async function updatepasswordweb(params, payload) {
    try {
        const { newpassword, otp } = params;
        var errorOTP = await notEmptyAndNull(otp);
        var errorNewpassword = await checkPassword(newpassword);
        if (errorOTP.status && errorNewpassword.status) {
            var errorValidator = await updatepasswordUser(params, payload);
            return errorValidator;
        } else {
            if (!errorOTP.status)
                return errorOTP;
            else if (!errorNewpassword.status)
                return errorNewpassword;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { updatepasswordweb };