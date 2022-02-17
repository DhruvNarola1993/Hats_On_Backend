var CommonValidator = require('../common/validator');
var TermService = require('../services/termcondition.services');
// get All
async function getterm(params) {
    try {
        var errorValidator = await TermService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert 
async function insertterm(params) {
    try {
        const { bulletpoint } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(bulletpoint);
        if (errorQuestion.status) {
            var errorValidator = await TermService.insertOne(params);
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
async function updateterm(params) {
    try {
        const { bulletpoint } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(bulletpoint);
        if (errorQuestion.status) {
            var errorValidator = await TermService.getUpdateOne(params);
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
async function deleteoneterm(params) {
    try {
        var errorValidator = await TermService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getterm, insertterm, updateterm, deleteoneterm };