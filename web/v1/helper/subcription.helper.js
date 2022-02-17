var { listSubcriptionServices, checkMobileStarcodeServices } = require('../services/subcription.services');
/**
 * 
 * Login 
 * 
 */
async function listSubcriptionHelper(params, payload) {
    try {
        var listSubcriptionService = await listSubcriptionServices(params, payload);
        return listSubcriptionService;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function checkMobileStarcodehelper(params, payload) {
    try {
        var checkMobileStarcodeService = await checkMobileStarcodeServices(params, payload);
        return checkMobileStarcodeService;
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


module.exports = { listSubcriptionHelper, checkMobileStarcodehelper };