var CommonValidator = require('../common/validator');
var FaqService = require('../services/faq.service');
// get All Faq
async function getfaq(params) {
    try {
        var errorValidator = await FaqService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert 
async function insertfaq(params) {
    try {
        const { question, answer } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(question);
        var errorAnswer = await CommonValidator.notEmptyAndNull(answer);
        if (errorQuestion.status && errorAnswer.status) {
            var errorValidator = await FaqService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
            else if (!errorAnswer.status)
                return errorAnswer;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updatefaq(params) {
    try {
        const { question, answer } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(question);
        var errorAnswer = await CommonValidator.notEmptyAndNull(answer);
        if (errorQuestion.status && errorAnswer.status) {
            var errorValidator = await FaqService.getUpdateOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
            else if (!errorAnswer.status)
                return errorAnswer;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonefaq(params) {
    try {
        var errorValidator = await FaqService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getfaq, insertfaq, updatefaq, deleteonefaq };