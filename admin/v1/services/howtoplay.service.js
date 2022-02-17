const client = require('../../../connection/redisconnection');
var Howtoplay = require('./../../../api/v1/models/howtoplay.model');
// All Data 
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
            countTotal = await Howtoplay.countDocuments({ "bulletpoint": { "$regex": search, "$options": 'i' } });
            findAll = await Howtoplay.aggregate([
                { $sort: sortObject },
                { $match: { "bulletpoint": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Howtoplay.countDocuments();
            findAll = await Howtoplay.aggregate([
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
        console.log(findAll);
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
                msg: "How to play is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Insert
async function insertOne(params) {
    try {
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = params.updateby;
        var insertData = await new Howtoplay(params);
        insertData.save();
        if (insertData != null) {
            await client.del("listhowtoplay");
            return {
                status: true,
                data: insertData
            };
        } else {
            return {
                status: false,
                msg: "Howtoplay error."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Update One Data
async function getUpdateOne(params) {
    try {
        const { _id, bulletpoint, updateby } = params;
        var findOne = await Howtoplay.findByIdAndUpdate(_id, { $set: { bulletpoint: bulletpoint, updatedate: new Date(), updateby: updateby } }, { new: true });
        if (findOne != null) {
            await client.del("listhowtoplay");
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Howtoplay is not present."
            };
        }
    } catch (error) {
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
        var deleteOne = await Howtoplay.findByIdAndDelete(id);
        if (deleteOne != null) {
            await client.del("listhowtoplay");
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Howtoplay is not delete."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { getAll, insertOne, getUpdateOne, oneDelete };