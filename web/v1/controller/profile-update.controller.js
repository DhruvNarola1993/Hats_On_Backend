const { getHelper, updateHelper } = require('../helper/profile-update.helper');
const { encrypt, decrypt } = require('../common/common.encrypt');
// Update Password
exports.updateController = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await updatepasswordweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await updateHelper(req.body, req.payload);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};

// Resend OTP
exports.getController = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await updatepasswordweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await getHelper(req.body, req.payload);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};