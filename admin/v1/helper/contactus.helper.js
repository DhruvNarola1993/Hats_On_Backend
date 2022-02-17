var CommonValidator = require('../common/validator');
var ContactService = require('../services/contactus.service');
// get All
async function getcontact(params) {
    try {
        var errorValidator = await ContactService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getcontact };