var CommonValidator = require('../common/validator');
var AdminService = require('../services/admin.service');
// Insert 
async function loginadmin(params) {
    try {
        const { email, password } = params;
        var errorEmail = await CommonValidator.notEmptyAndNull(email);
        var errorPassword = await CommonValidator.notEmptyAndNull(password);
        if (errorEmail.status && errorPassword.status) {
            var errorValidator = await AdminService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorEmail.status)
                return errorEmail;
            else if (!errorPassword.status)
                return errorPassword;
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updateadmin(params) {
    try {
        const { email, password } = params;
        var errorEmail = await CommonValidator.notEmptyAndNull(email);
        var errorPassword = await CommonValidator.notEmptyAndNull(password);
        if (errorEmail.status && errorPassword.status) {
            var errorValidator = await AdminService.getUpdateOne(params);
            return errorValidator;
        } else {
            if (!errorEmail.status)
                return errorEmail;
            else if (!errorPassword.status)
                return errorPassword;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get one admin
async function getadminone(params) {
    try {
        var errorValidator = await AdminService.getOne(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { loginadmin, updateadmin, getadminone };