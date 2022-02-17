const { loginweb, refreshtokenweb, logoutweb } = require('../helper/login.helper');
const { encrypt, decrypt } = require('../common/common.encrypt');
// Login
exports.loginWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await loginweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        console.log(req.body)
        var response = await loginweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};
// Login After Refresh Token
exports.refreshtokenWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await refreshtokenweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await refreshtokenweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};
// Log out
exports.logoutWeb = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await logoutweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await logoutweb(req.body);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};