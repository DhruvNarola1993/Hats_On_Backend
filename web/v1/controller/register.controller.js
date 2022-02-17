const { registerweb, verifyweb, forgetpasswordweb, resetpasswordweb, resendotpweb, customValidator, socialValidator } = require('../helper/register.helper');
const { encrypt, decrypt } = require('../common/common.encrypt');
const { customCountUser, socialCountUser, saveUser } = require('../services/register.service');
// Register
exports.registerWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await registerweb(JSON.parse(request));
        // response = await decrypt(response);

        const { issocial } = req.body;
        req.body.devicetype = "WEB";
        req.body.registerdate = new Date();
        if (!issocial) {
            const { password } = req.body;
            errorMsg = await customValidator(req.body);
            if (errorMsg.status == false) {
                // Error
                res.json(errorMsg);
            } else if (errorMsg.status == true) {
                errorMsg = await customCountUser(req.body);
                if (errorMsg.status) {
                    var insertCustom = await registerweb(req.body);
                    // Insert error and return
                    res.json(insertCustom);
                } else {
                    // Error
                    res.json(errorMsg);
                }
            }
        } else if(issocial) {
            errorMsg = await socialValidator(req.body);
            if (errorMsg.status == false) {
                // Error
                res.json(errorMsg);
            } else if (errorMsg.status) {
                // console.log(payload);
                errorMsg = await socialCountUser(req.body);
                console.log(errorMsg)
                if (errorMsg.status) {
                    var insertUser = await saveUser(req.body);
                    // Insert error and return
                    res.json(insertUser);

                } else {
                    // Error
                    if (errorMsg.code == 0) {
                        res.json(errorMsg);
                    } else {
                        res.json(errorMsg);
                    }
                   
                }
            }
        } else {
            // Error
            res.json({status: false, msg: "Error on register."});
        }
    } catch (error) {
        // response = await encrypt(null);
        res.json({ error: error });
    }
};
// Verify
exports.verifyWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // console.log(request);
        // response = await verifyweb(JSON.parse(request));
        // console.log(response)
        // response = await encrypt(response);
        var response = await verifyweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};
// Resend OTP
exports.resendotpWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // console.log(request);
        // response = await resendotpweb(JSON.parse(request));
        // console.log(response)
        // response = await encrypt(response);
        var response = await resendotpweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }

};
// Forget Password
exports.forgetpasswordWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await forgetpasswordweb(JSON.parse(request));
        // response = await encrypt(response);
        var response = await forgetpasswordweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};
// Reset Password
exports.resetpasswordWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await resetpasswordweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        console.log(req.body)
        var response = await resetpasswordweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};