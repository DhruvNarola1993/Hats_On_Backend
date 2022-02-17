var Rating = require('./../../../api/v1/models/rating.model');
var Level = require('./../../../api/v1/models/level.model');
// Rating All Data 
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
        if (search != "") {
            countTotal = await Rating.countDocuments({ "name": { "$regex": search, "$options": 'i' } });
            findAll = await Rating.aggregate([
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
            countTotal = await Rating.countDocuments();
            findAll = await Rating.aggregate([
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
                msg: "Rating is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Rating Get One Data
async function getUpdateOne(params) {
    try {
        const { _id, name, updateby } = params;
        var findOne = await Rating.findByIdAndUpdate(_id, { $set: { name: name, updatedate: new Date(), updateby: updateby } }, { new: true });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Rating is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Rating Get One Data
async function insertOne(params) {
    try {
        const { name, updateby } = params;
        var countRating = await Rating.countDocuments({ name: name });
        if (countRating == 0) {
            params.createdate = new Date();
            params.updatedate = new Date();
            params.createby = updateby;
            var insertRating = await new Rating(params);
            insertRating.save();
            if (insertRating != null) {
                return {
                    status: true,
                    data: insertRating
                };
            } else {
                return {
                    status: false,
                    msg: "Rating error."
                };
            }
        } else {
            return {
                status: false,
                msg: "Rating is already present."
            };
        }
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
        var deleteOne = await Rating.findByIdAndDelete(id);
        if (deleteOne != null) {
            await Level.deleteMany({ ratingid: id });
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Rating is not delete."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { getAll, getUpdateOne, insertOne, oneDelete };