var { notEmptyAndNull } = require('../common/validator');
var { insertOne, oneDelete, getAll, getUpdateOne } = require('../services/hording.services');
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
// Get All
async function getall(params) {
    try {
        var errorValidator = await getAll(params);
        return errorValidator;
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
module.exports = { insertone, getall, updateone, deleteone };