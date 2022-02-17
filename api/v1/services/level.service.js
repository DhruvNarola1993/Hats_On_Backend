
var Level = require('../models/level.model');

async function listAllLevel(params) {
    try {
        const { id } = params;
        var listLevel = await Level.find({ ratingid: id }).select({ levelno: 1, name: 1, _id: 1, winlevel: 1, point: 1, ratingid: 1, movelevelid: 1 });
        if (listLevel.length >= 0) {
            return {
                status: true,
                listLevel: listLevel
            };
        } else {
            return {
                status: false,
                msg: "Something went wrong with rating and level."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { listAllLevel };