var CommonValidator = require('../common/validator');
var SubscrptionService = require('../services/subscription.services');
// get All
async function getsubscription(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
        var errorsortKey = await CommonValidator.notEmptyAndNull(sortKey);
        var errorsortOrder = await CommonValidator.notEmptyAndNull(sortOrder);
        if (errorsortKey.status && errorsortOrder.status) {
            var errorValidator = await SubscrptionService.getAll(params);
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
// Insert
async function insertsubscription(params) {
    try {
        const { name, fees, feesandcharges, starreferralpercentage, standardreferralpoints } = params;
        var errorkey = await CommonValidator.notEmptyAndNull(name);
        var errorFees = await CommonValidator.isNumber(fees);
        var errorFeesandcharges = await CommonValidator.isNumber(feesandcharges);
        var errorStarreferralpercentage = await CommonValidator.isNumber(starreferralpercentage);
        var errorStandardreferralpoints = await CommonValidator.isNumber(standardreferralpoints);
        if (errorkey.status && errorFees.status && errorStarreferralpercentage.status && errorStandardreferralpoints.status && errorFeesandcharges.status) {
            errorValidator = await SubscrptionService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorkey.status)
                return errorkey;
            else if (!errorFees.status)
                return errorFees;
            else if (!errorFeesandcharges.status)
                return errorFeesandcharges;
            else if (!errorStandardreferralpoints.status)
                return errorStandardreferralpoints;
            else if (!errorStarreferralpercentage.status)
                return errorStarreferralpercentage;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updatesubscription(params) {
    try {
        const { _id, fees, feesandcharges, starreferralpercentage, standardreferralpoints } = params;
        var errorId = await CommonValidator.isObjectID(_id);
        var errorFees = await CommonValidator.isNumber(fees);
        var errorFeesandcharges = await CommonValidator.isNumber(feesandcharges);
        var errorStarreferralpercentage = await CommonValidator.isNumber(starreferralpercentage);
        var errorStandardreferralpoints = await CommonValidator.isNumber(standardreferralpoints);
        if (errorId.status && errorFees.status && errorStarreferralpercentage.status && errorStandardreferralpoints.status && errorFeesandcharges.status) {
            var errorValidator = await SubscrptionService.getUpdateOne(params);
            return errorValidator;
        } else {
            if (!errorId.status)
                return errorId;
            else if (!errorFees.status)
                return errorFees;
            else if (!errorFeesandcharges.status)
                return errorFeesandcharges;
            else if (!errorStandardreferralpoints.status)
                return errorStandardreferralpoints;
            else if (!errorStarreferralpercentage.status)
                return errorStarreferralpercentage;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonesubscription(params) {
    try {
        var errorValidator = await SubscrptionService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete keyword 
module.exports = { getsubscription, insertsubscription, updatesubscription, deleteonesubscription };