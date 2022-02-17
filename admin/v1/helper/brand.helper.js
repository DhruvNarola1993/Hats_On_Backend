var { notEmptyAndNull } = require('../common/validator');
var BrandService = require('../services/brand.code.services');
// Insert Rating
async function insertone(params) {
    try {
        const { brandcode } = params;
        var errorValidator = await notEmptyAndNull(brandcode);
        if (errorValidator.status) {
            errorValidator = await BrandService.insertOne(params);
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
        var errorValidator = await BrandService.getAll(params);
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
        const { brandcode } = params;
        var errorValidator = await notEmptyAndNull(brandcode);
        if (errorValidator.status) {
            errorValidator = await BrandService.getUpdateOne(params);
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
        var errorValidator = await BrandService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { insertone, getall, updateone, deleteone };