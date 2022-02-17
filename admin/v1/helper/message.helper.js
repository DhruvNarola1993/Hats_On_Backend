var CommonValidator = require('../common/validator');
var MessageService = require('../services/message.service');
// get All
async function getmessage(params) {
    try {
        var errorValidator = await MessageService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert
async function insertmessage(params) {
    try {
        const { key, message } = params;
        var errorkey = await CommonValidator.notEmptyAndNull(key);
        var errormessage = await CommonValidator.notEmptyAndNull(message);
        if (errorkey.status && errormessage.status) {
            errorValidator = await MessageService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorkey.status)
                return errorkey;
            else if (!errormessage.status)
                return errormessage;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update 
async function updatemessage(params) {
    try {
        const { message } = params;
        var errormessage = await CommonValidator.notEmptyAndNull(message);
        if (errormessage.status) {
            var errorValidator = await MessageService.getUpdateOne(params);
            return errorValidator;
        } else {
            return errormessage;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonemessage(params) {
    try {
        var errorValidator = await MessageService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getmessage, deleteonemessage, updatemessage, insertmessage };