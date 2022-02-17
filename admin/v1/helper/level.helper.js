var CommonValidator = require('../common/validator');
var LevelService = require('../services/level.service');
// get All
async function getlevel(params) {
    try {
        var errorValidator = await LevelService.getAll(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert Level
async function insertlevel(params) {
    try {
        const { name, winlevel, point } = params;
        // var errorName = await CommonValidator.notEmptyAndNull(name);
        var errorWinlevel = await CommonValidator.isNumber(winlevel);
        var errorPoint = await CommonValidator.isNumber(point);
        if (errorWinlevel.status && errorPoint.status) {
            errorValidator = await LevelService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorWinlevel.status)
                return errorWinlevel;
            else if (!errorPoint.status)
                return errorPoint;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updatelevel(params) {
    try {
        const { name, winlevel, point } = params;
        var errorName = await CommonValidator.notEmptyAndNull(name);
        var errorWinlevel = await CommonValidator.isNumber(winlevel);
        var errorPoint = await CommonValidator.isNumber(point);
        if (errorName.status && errorWinlevel.status && errorPoint.status) {
            errorValidator = await LevelService.updateOne(params);
            return errorValidator;
        } else {
            if (!errorName.status)
                return errorName;
            else if (!errorWinlevel.status)
                return errorWinlevel;
            else if (!errorPoint.status)
                return errorPoint;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonelevel(params) {
    try {
        var errorValidator = await LevelService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { getlevel,  insertlevel, deleteonelevel, updatelevel };