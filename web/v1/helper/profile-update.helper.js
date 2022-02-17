var { notEmptyAndNull } = require('./../common/common.validator');
var { getServices, updateServices } = require('../services/profile-update.services');
// Update cart File
async function updateHelper(params, payload) {
    try {
        // name, lastname, city  --  medentory
        const { name, lastname, state, dateofbirth } = params;
        var errorName = await notEmptyAndNull(name);
        var errorLastname = await notEmptyAndNull(lastname);
        var errorState = await notEmptyAndNull(state);
        var errorDateOfBirth = await notEmptyAndNull(dateofbirth);
        if (errorName.status && errorLastname.status && errorState.status && errorDateOfBirth.status) {
            errorValidator = await updateServices(params, payload);
            return errorValidator;
        } else {
            if (!errorName.status)
                return errorName;
            else if (!errorLastname.status)
                return errorLastname;
            else if (!errorState.status)
                return errorState;
            else if(!errorDateOfBirth.status) 
                return errorDateOfBirth;    
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}


async function getHelper(params, payload) {
    try {
        var errorValidator = await getServices(params, payload);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { updateHelper, getHelper };