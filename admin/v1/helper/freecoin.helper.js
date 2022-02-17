var CommonValidator = require('../common/validator');
var FreecoinService = require('../services/freecoin.service');
// get All
async function getfreecoin(params) {
    try {
        var errorValidator = await FreecoinService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert
async function insertfreecoin(params) {
    try {
        const { coins } = params;
        var errorkey = await CommonValidator.isNumber(coins);
        if (errorkey.status) {
            errorValidator = await FreecoinService.insertOne(params);
            return errorValidator;
        } else {
            return errorkey;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updatefreecoin(params) {
    try {
        var errorValidator = await FreecoinService.getUpdateOne(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonefreecoin(params) {
    try {
        var errorValidator = await FreecoinService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getfreecoin, insertfreecoin, updatefreecoin, deleteonefreecoin };