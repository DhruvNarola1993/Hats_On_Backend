var CommonValidator = require('../common/validator');
var MultiplayerAdsService = require('../services/multiplayer.ads.version.status.service');
// get All Keyword
async function getmultiplayerads(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
        var errorsortKey = await CommonValidator.notEmptyAndNull(sortKey);
        var errorsortOrder = await CommonValidator.notEmptyAndNull(sortOrder);
        if (errorsortKey.status && errorsortOrder.status) {
            var errorValidator = await MultiplayerAdsService.getAll(params);
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
async function insertmultiplayerads(params) {
    try {
        const { name } = params;
        var errorkey = await CommonValidator.notEmptyAndNull(name);
        if (errorkey.status) {
            errorValidator = await MultiplayerAdsService.insertOne(params);
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
async function updatemultiplayerads(params) {
    try {
        const { _id, value } = params;
        var errorValidator = await MultiplayerAdsService.getUpdateOne(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonemultiplayerads(params) {
    try {
        var errorValidator = await MultiplayerAdsService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
 
module.exports = { getmultiplayerads, insertmultiplayerads, updatemultiplayerads, deleteonemultiplayerads };