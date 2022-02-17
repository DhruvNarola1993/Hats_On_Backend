var CommonService = require('./common.service');
// Get All
async function getlevelcombo() {
    try {
        var errorValidator = await CommonService.getLevelCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function getratingcombo() {
    try {
        var errorValidator = await CommonService.getRatingCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function gettournamentcombo() {
    try {
        var errorValidator = await CommonService.getTournamentCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function getstarusercombo() {
    try {
        var errorValidator = await CommonService.getStarUserCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function getsubcriptiondemo() {
    try {
        var errorValidator = await CommonService.getSubcribeCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function getpointcombo() {
    try {
        var errorValidator = await CommonService.getPointCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function getstaruserpanelcombo() {
    try {
        var errorValidator = await CommonService.getStarUserListCombo();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get All
async function getpromocodecombo() {
    try {
        var errorValidator = await CommonService.getPromoCode();
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getlevelcombo, getratingcombo, gettournamentcombo, getstarusercombo, getsubcriptiondemo, getpointcombo, getstaruserpanelcombo, getpromocodecombo };