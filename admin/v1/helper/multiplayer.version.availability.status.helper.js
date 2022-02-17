var CommonValidator = require('../common/validator');
var MultiplayerService = require('../services/multiplayer.version.availability.status.service');
// get All Keyword
async function getmultiplayer(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
        var errorsortKey = await CommonValidator.notEmptyAndNull(sortKey);
        var errorsortOrder = await CommonValidator.notEmptyAndNull(sortOrder);
        if (errorsortKey.status && errorsortOrder.status) {
            var errorValidator = await MultiplayerService.getAll(params);
            return errorValidator;
        } else {
            if (!errorsortKey.status)
                return errorsortKey;
            else if (!errorsortOrder.status)
                return errorsortOrder;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert Keyword
async function insertmultiplayer(params) {
    try {
        const { name } = params;
        var errorkey = await CommonValidator.notEmptyAndNull(name);
        if (errorkey.status) {
            errorValidator = await MultiplayerService.insertOne(params);
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
// Update keyword
async function updatemultiplayer(params) {
    try {
        const { _id, value } = params;
        var errorValidator = await MultiplayerService.getUpdateOne(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonemultiplayer(params) {
    try {
        var errorValidator = await MultiplayerService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete keyword 
module.exports = { getmultiplayer, insertmultiplayer, updatemultiplayer, deleteonemultiplayer };