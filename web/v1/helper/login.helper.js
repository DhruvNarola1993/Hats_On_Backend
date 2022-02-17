var { isBoolean, isNumber, notEmptyAndNull } = require('../common/common.validator');
var { getCustomeLogin, getSocailLogin, getReferenceToken, logoutUser } = require('../services/login.service');
// Login  
async function loginweb(params) {
    try {
        const { issocial } = params;
        var errorIssocial = await isBoolean(issocial);
        if (errorIssocial.status) {
            if (issocial) {
                const { userid } = params;
                var errorUsername = await notEmptyAndNull(userid);
                if (errorUsername.status) {
                    var errorValidator = await getSocailLogin(params);
                    return errorValidator;
                } else {
                    if (!errorUsername.status)
                        return errorUsername;
                }
            } else {
                const { mobile, password } = params;
                var errorMobile = await notEmptyAndNull(mobile);
                var errorPassword = await notEmptyAndNull(password);
                if (errorMobile.status && errorPassword.status) {
                    var errorValidator = await getCustomeLogin(params);
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
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Reference Token
async function refreshtokenweb(params) {
    try {
        const { refreshToken } = params;
        var errorToken = await notEmptyAndNull(refreshToken);
        if (errorToken.status) {
            var errorValidator = await getReferenceToken(params);
            return errorValidator;  
        } else {
            if (!errorToken.status)
                return errorToken;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Log out
async function logoutweb(params) {
    try {
        const { refreshToken } = params;
        var errorToken = await notEmptyAndNull(refreshToken);
        if (errorToken.status) {
            var errorValidator = await logoutUser(params);
            return errorValidator;  
        } else {
            if (!errorToken.status)
                return errorToken;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { loginweb,  refreshtokenweb, logoutweb };