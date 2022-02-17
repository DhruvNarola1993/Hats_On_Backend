var CommonValidator = require('../common/validator');
var KeywordService = require('../services/keyword.service');
// get All
async function getkeyword(params) {
    try {
        var errorValidator = await KeywordService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert
async function insertkeyword(params) {
    try {
        const { key, value, type } = params;
        var errorkey = await CommonValidator.notEmptyAndNull(key);
        if (errorkey.status) {
            errorValidator = await KeywordService.insertOne(params);
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
async function updatekeyword(params) {
    try {
        var errorValidator = await KeywordService.getUpdateOne(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonekeyword(params) {
    try {
        var errorValidator = await KeywordService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getkeyword, insertkeyword, updatekeyword, deleteonekeyword };