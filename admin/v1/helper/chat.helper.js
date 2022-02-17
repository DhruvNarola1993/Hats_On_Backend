var CommonValidator = require('../common/validator');
var chatService = require('../services/chat.services');
// get All chat
async function getchat(params) {
    try {
        var errorValidator = await chatService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert 
async function insertchat(params) {
    try {
        const { question, answer } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(question);
        var errorAnswer = await CommonValidator.notEmptyAndNull(answer);
        if (errorQuestion.status && errorAnswer.status) {
            var errorValidator = await chatService.insertOne(params);
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
async function updatechat(params) {
    try {
        const { question, answer } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(question);
        var errorAnswer = await CommonValidator.notEmptyAndNull(answer);
        if (errorQuestion.status && errorAnswer.status) {
            var errorValidator = await chatService.getUpdateOne(params);
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
async function deleteonechat(params) {
    try {
        var errorValidator = await chatService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getchat, insertchat, updatechat, deleteonechat };