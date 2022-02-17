var CommonValidator = require('../common/validator');
var RatingService = require('../services/rating.service');
// Insert Rating
async function insertrating(params) {
    try {
        const { name } = params;
        var errorValidator = await CommonValidator.notEmptyAndNull(name);
        if (errorValidator.status) {
            errorValidator = await RatingService.insertOne(params);
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
async function getratings(params) {
    try {
        var errorValidator = await RatingService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get one rating update
async function updaterating(params) {
    try {
        const { name } = params;
        var errorValidator = await CommonValidator.notEmptyAndNull(name);
        if (errorValidator.status) {
            errorValidator = await RatingService.getUpdateOne(params);
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
async function deleteonerating(params) {
    try {
        var errorValidator = await RatingService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { insertrating, getratings, updaterating, deleteonerating };