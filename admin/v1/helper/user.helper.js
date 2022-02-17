var CommonValidator = require('../common/validator');
var UserService = require('../services/user.service');
// Get All
async function getuser(params) {
    try {
        var errorValidator = await UserService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update Level and Rating
async function updatelevelratingforuser(params) {
    try {
        var errorValidator = await UserService.updateOneForLevelRating(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getuser, updatelevelratingforuser };