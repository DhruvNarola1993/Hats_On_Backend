
var Rating = require('../models/rating.model');

async function listAllRating(params) {
    try {
        var listRating = await Rating.aggregate().lookup({
            from: "levels",
            localField: "_id",
            foreignField: "ratingid",
            as: "levels"
        }).project({
            "_id": 0,
            "rateno": "$rateno",
            "minplayer": "$minplayer",
            "maxplayer": "$maxplayer",
            "levels._id": 1,
            "levels.levelno": 1,
            "levels.point": 1,
            "levels.ratingid": 1,
            "levels.winlevel": 1,
            "levels.movelevelid": 1
        });
        if (listRating.length >= 0) {
            return {
                status: true,
                listRatingLevel: listRating
            };
        } else {
            return {
                status: false,
                msg: "Rating and Level is empty.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

module.exports = { listAllRating };