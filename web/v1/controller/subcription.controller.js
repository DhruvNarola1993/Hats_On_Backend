const { listSubcriptionHelper, checkMobileStarcodehelper } = require('../helper/subcription.helper');
// const { encrypt, decrypt } = require('../common/common.encrypt');
// Login
exports.listSubcriptionController = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await loginweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await listSubcriptionHelper(req.body, req.payload);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};

// Check Mobile And Star Code
exports.checkMobileStarcodeController = async (req, res, next) => {
    var response;
    try {
        // var request = await decrypt(req.body);
        // response = await loginweb(JSON.parse(request));
        // response = await encrypt(JSON.stringify(response));
        var response = await checkMobileStarcodehelper(req.body, req.payload);
        res.json(response);
    } catch (error) {
        // response = await encrypt(null);
        // res.json(response);
        res.json({ error: error });
    }
};

