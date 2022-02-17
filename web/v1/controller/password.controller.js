const { updatepasswordweb } = require('../helper/password.helper');
const { encrypt, decrypt } = require('../common/common.encrypt');
// Update Password
exports.updatepasswordWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await updatepasswordweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await updatepasswordweb(req.body, req.payload);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};

// Resend OTP
exports.sendOtpForUpdatePassword = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await updatepasswordweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        res.json({
            status: true,
            msg: "Send successfully password."
        });
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};