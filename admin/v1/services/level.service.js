const Rating = require('../../../api/v1/models/rating.model');
const client = require('../../../connection/redisconnection');
var Level = require('./../../../api/v1/models/level.model');
var _ = require("lodash");
// Level All Data 
async function getAll(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
        var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
        var documentLimit = parseInt(pageSize);
        var countTotal = 0;
        var sortorder = sortOrder == "desc" ? -1 : 1; // Server Get Point Order asc or desc  
        var sortkey = sortKey;
        var sortObject = {};
        sortObject[sortkey] = sortorder;
        var findAll;
        if (search != "" && search != undefined && search != null) {
            countTotal = await Level.countDocuments({ "name": { "$regex": search, "$options": 'i' } });
            findAll = await Level.aggregate([
                { $sort: sortObject },
                { $match: { "name": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Level.countDocuments();
            findAll = await Level.aggregate([
                { $sort: sortObject },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        }
        if (findAll.length > 0) {
            return {
                status: true,
                data: {
                    dataSource: findAll,
                    length: countTotal
                }
            };
        } else {
            return {
                status: false,
                msg: "Level is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Level Get One Data
async function insertOne(params) {
    try {
        const { name, winlevel, point, ratingid } = params;
        var countLevel = await Level.countDocuments({ ratingid: ratingid });
        var getRating = await Rating.find({}, { rateno: 1, name: 1 });
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = params.updateby;
        delete params.ratingid;
        // await Level.updateMany({ levelno: { "$gt": countLevel } }, { $inc: { levelno: 1 } })
        for (let index = 0; index < getRating.length; index++) {
            if (getRating[index].rateno == 2) {
                await Level.updateMany({ ratingid: getRating[index]._id }, { $inc: { levelno: 1 } })
            }
            if (getRating[index].rateno == 3) {
                await Level.updateMany({ ratingid: getRating[index]._id }, { $inc: { levelno: 2 } })
            }
        }
        for (let index = 0; index < getRating.length; index++) {
            params.ratingid = getRating[index]._id;
            params.levelno = parseInt(parseInt(getRating[index].rateno) * parseInt(countLevel + 1));
            params.name = getRating[index].name + "  " + parseInt(countLevel + 1);
            var insertLevel = await new Level(params);
            await insertLevel.save();
        }
        await client.del('listRatingLevel')
        return {
            status: true,
            data: {}
        };
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Level Update
async function updateOne(params) {
    try {
        const { _id, updateby, name, winlevel, point, ratingid, movelevelid } = params;
        // var countLevel = await Level.countDocuments({ levelno: levelno });
        // if (countLevel == 0) {
        var findOne = await Level.findByIdAndUpdate(_id, { $set: { movelevelid: movelevelid, name: name, winlevel: winlevel, point: point, updatedate: new Date(), updateby: updateby } }, { new: true });
        if (findOne != null) {
            await client.del('listRatingLevel')
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Level error."
            };
        }
        // else if (countLevel == 1) {
        //     var findOne = await Level.findByIdAndUpdate(_id, { $set: { movelevelid: movelevelid, name: name, winlevel: winlevel, point: point, ratingid: ratingid, updatedate: new Date(), updateby: updateby } }, { new: true });
        //     if (findOne != null) {
        //         return {
        //             status: true,
        //             data: findOne
        //         };
        //     } else {
        //         return {
        //             status: false,
        //             msg: "Level error."
        //         };
        //     }
        // } else {
        //     return {
        //         status: false,
        //         msg: "Level is already present."
        //     };
        // }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Delete
async function oneDelete(params) {
    try {
        const { id } = params;
        var countLevel = await Level.countDocuments();
        var deleteOne = await Level.findById(id);
        if (deleteOne != null) {
            var getRateNo = await Rating.findById(deleteOne.ratingid);
            var perLevelCount = parseInt(countLevel / 3);
            var deleteCurrentNumber = deleteOne.levelno;
            var gteNumber = -1;
            var lteNumber = -1;
            var deleteArray = [];
            if (getRateNo.rateno == 1) {
                gteNumber = deleteCurrentNumber;
                lteNumber = countLevel;
                deleteArray.push(deleteCurrentNumber);
                deleteArray.push(deleteCurrentNumber + perLevelCount);
                deleteArray.push(deleteCurrentNumber + perLevelCount + perLevelCount);
            } else if (getRateNo.rateno == 2) {
                gteNumber = deleteCurrentNumber - perLevelCount;
                lteNumber = countLevel;
                deleteArray.push(deleteCurrentNumber - perLevelCount);
                deleteArray.push(deleteCurrentNumber);
                deleteArray.push(deleteCurrentNumber + perLevelCount);
            } else if (getRateNo.rateno == 3) {
                gteNumber = deleteCurrentNumber - perLevelCount - perLevelCount;
                lteNumber = countLevel;
                deleteArray.push(deleteCurrentNumber);
                deleteArray.push(deleteCurrentNumber - perLevelCount);
                deleteArray.push(deleteCurrentNumber - perLevelCount - perLevelCount);
            }
            await Level.deleteMany({ levelno: { $in: deleteArray } });
            deleteArray = _.sortBy(deleteArray);
            await Level.updateMany({ levelno: { $gt: gteNumber, $lt: deleteArray[1] } }, { $inc: { levelno: -1 } })
            await Level.updateMany({ levelno: { $gt: deleteArray[1], $lt: deleteArray[2] } }, { $inc: { levelno: -2 } })
            await Level.updateMany({ levelno: { $gt: deleteArray[2] } }, { $inc: { levelno: -3 } })


            return {
                status: true,
                data: {
                    updateNumberFrom: gteNumber,
                    updateNumberTo: lteNumber,
                    deleteArray: deleteArray,
                    minusOne: deleteArray[0] + " " + deleteArray[1],
                    minusTwo: deleteArray[1] + " " + lteNumber
                }
            };
        } else {
            return {
                status: false,
                msg: "Level is not delete."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { getAll, insertOne, oneDelete, updateOne };