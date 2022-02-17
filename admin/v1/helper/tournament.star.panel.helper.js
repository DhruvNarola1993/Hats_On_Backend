var { notEmptyAndNull } = require('../common/validator');
var { getAll, insertOne, getUpdateOne, oneDelete } = require('../services/tournament.star.panel.service');
// get All
async function gettournament(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder } = params;
        var errorsortKey = await notEmptyAndNull(sortKey);
        var errorsortOrder = await notEmptyAndNull(sortOrder);
        if (errorsortKey.status && errorsortOrder.status) {
            var errorValidator = await getAll(params);
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

// Insert Rating
async function insertone(params) {
    try {
        const { imageurl } = params;
        var errorValidator = await notEmptyAndNull(imageurl);
        if (errorValidator.status) {
            errorValidator = await insertOne(params);
            return errorValidator;
        } else {
            return errorValidator;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Get one rating update
async function updateone(params) {
    try {
        const { imageurl } = params;
        var errorValidator = await notEmptyAndNull(imageurl);
        if (errorValidator.status) {
            errorValidator = await getUpdateOne(params);
            return errorValidator;
        } else {
            return errorValidator;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteone(params) {
    try {
        var errorValidator = await oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

module.exports = { gettournament, insertone, updateone, deleteone };