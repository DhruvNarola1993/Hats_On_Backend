var CommonValidator = require('../common/validator');
var HowtoplayService = require('../services/howtoplay.service');
// get All
async function gethowtoplay(params) {
    try {
        var errorValidator = await HowtoplayService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert 
async function inserthowtoplay(params) {
    try {
        const { bulletpoint } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(bulletpoint);
        if (errorQuestion.status) {
            var errorValidator = await HowtoplayService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updatehowtoplay(params) {
    try {
        const { bulletpoint } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(bulletpoint);
        if (errorQuestion.status) {
            var errorValidator = await HowtoplayService.getUpdateOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonehowtoplay(params) {
    try {
        var errorValidator = await HowtoplayService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { gethowtoplay, inserthowtoplay, updatehowtoplay, deleteonehowtoplay };