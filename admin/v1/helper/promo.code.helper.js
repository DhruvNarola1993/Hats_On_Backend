var { notEmptyAndNull } = require('../common/validator');
var PromoService = require('../services/promo.code.services');
// Insert Rating
async function insertone(params) {
    try {
        const { promocode } = params;
        var errorValidator = await notEmptyAndNull(promocode);
        if (errorValidator.status) {
            errorValidator = await PromoService.insertOne(params);
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
async function getall(params) {
    try {
        var errorValidator = await PromoService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Get one rating update
async function updateone(params) {
    try {
        const { promocode } = params;
        var errorValidator = await notEmptyAndNull(promocode);
        if (errorValidator.status) {
            errorValidator = await PromoService.getUpdateOne(params);
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
async function deleteone(params) {
    try {
        var errorValidator = await PromoService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { insertone, getall, updateone, deleteone };