var CommonValidator = require('../common/validator');
var ComputercoinService = require('../services/computercoin.service');
// get All
async function getcomputercoin(params) {
    try {
        var errorValidator = await ComputercoinService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert
async function insertcomputercoin(params) {
    try {
        const { coins } = params;
        var errorkey = await CommonValidator.isNumber(coins);
        if (errorkey.status) {
            errorValidator = await ComputercoinService.insertOne(params);
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
async function updatecomputercoin(params) {
    try {
        var errorValidator = await ComputercoinService.getUpdateOne(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonecomputercoin(params) {
    try {
        var errorValidator = await ComputercoinService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getcomputercoin, insertcomputercoin, updatecomputercoin, deleteonecomputercoin };