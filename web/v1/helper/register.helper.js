const { checkEmail, checkLogintype } = require('../../../api/v1/validations/register.validator');
var { isBoolean, isNumber, notEmptyAndNull, checkPassword } = require('../common/common.validator');
var { getCustomeRegister, getSocailRegister, verifyOtp, foregetPassword, resetPassword, sendOtp, saveUser } = require('../services/register.service');
// Register  
async function registerweb(params) {
    try {
        const { issocial } = params;
        var errorIssocial = await isBoolean(issocial);
        if (errorIssocial.status) {
            if (issocial) {
                const { email, logintype, mobile } = params;
                var errorMobile = await notEmptyAndNull(mobile);
                var errorUsername = await notEmptyAndNull(email);
                var errorLogintype = await notEmptyAndNull(logintype);
                if (errorUsername.status && errorLogintype.status && errorMobile.status) {
                    var errorValidator = await getSocailRegister(params);
                    return errorValidator;
                } else {
                    if (!errorUsername.status)
                        return errorUsername;
                    else if (!errorLogintype.status)
                        return errorLogintype;
                    else if (!errorMobile.status)
                        return errorMobile;
                }
            } else {
                const { mobile, password } = params;
                var errorMobile = await notEmptyAndNull(mobile);
                var errorPassword = await checkPassword(password);
                if (errorMobile.status && errorPassword.status) {
                    var errorValidator = await saveUser(params);
                    return errorValidator;
                } else {
                    if (!errorMobile.status)
                        return errorMobile;
                    else if (!errorPassword.status)
                        return errorPassword;
                }
            }
        } else {
            if (!errorIssocial.status)
                return errorIssocial;
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Verify User
async function verifyweb(params) {
    try {
        const { mobile, otp } = params;
        var errorMobile = await notEmptyAndNull(mobile);
        var errorOtp = await notEmptyAndNull(otp);
        if (errorMobile.status && errorOtp.status) {
            var errorValidator = await verifyOtp(params);
            return errorValidator;
        } else {
            if (!errorMobile.status)
                return errorMobile;
            else if (!errorOtp.status)
                return errorOtp;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Forget Password
async function forgetpasswordweb(params) {
    try {
        const { mobile } = params;
        var errorMobile = await notEmptyAndNull(mobile);
        if (errorMobile.status) {
            var errorValidator = await foregetPassword(params);
            return errorValidator;
        } else {
            if (!errorMobile.status)
                return errorMobile;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Reset Password
async function resetpasswordweb(params) {
    try {
        const { mobile, newpassword } = params;
        var errorMobile = await notEmptyAndNull(mobile);
        var errorNewpassword = await checkPassword(newpassword);
        if (errorMobile.status && errorNewpassword.status) {
            var errorValidator = await resetPassword(params);
            return errorValidator;
        } else {
            if (!errorMobile.status)
                return errorMobile;
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
// Resend OTP
async function resendotpweb(params) {
    try {
        const { mobile, otptype } = params;
        var errorMobile = await notEmptyAndNull(mobile);
        var errorOtptype = await isBoolean(otptype);
        if (errorMobile.status && errorOtptype.status) {
            var errorValidator = await sendOtp(params);
            return errorValidator;
        } else {
            if (!errorMobile.status)
                return errorMobile;
            else if (!errorOtptype.status)
                return errorOtptype;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

async function customValidator(payload) {
    try {
        // password
        const { password } = payload;
        var errorMsgPassword = await checkPassword(password);
        if (errorMsgPassword.status) {
            return errorMsgPassword;
        } else {
            return errorMsgPassword;
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
        const { userid, logintype } = payload;
        var errorMsgEmail = await notEmptyAndNull(userid);
        var errorMsgLogintype = await checkLogintype(logintype);
        if (errorMsgEmail.status && errorMsgLogintype.status) {
            return errorMsgEmail && errorMsgLogintype;
        } else {
            if (!errorMsgEmail.status)
                return errorMsgEmail;
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
module.exports = { registerweb, verifyweb, resendotpweb, forgetpasswordweb, resetpasswordweb, customValidator, socialValidator };