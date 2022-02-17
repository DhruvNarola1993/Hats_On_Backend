const client = require('../../../connection/redisconnection');
var Keyword = require('./../../../api/v1/models/keyword.model');
// Keyword All Data 
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
        if (search != "" && search != undefined && search  != null) {
            countTotal = await Keyword.countDocuments({ "key": { "$regex": search, "$options": 'i' } });
            findAll = await Keyword.aggregate([
                { $sort: sortObject },
                { $match: { "key": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Keyword.countDocuments();
            findAll = await Keyword.aggregate([
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
                msg: "Keyword is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// keyword Insert
async function insertOne(params) {
    try {
        const { key, value, type, updateby } = params;
        var countKeyword = await Keyword.countDocuments({ key: key });
        if (countKeyword == 0) {
            params.createdate = new Date();
            params.updatedate = new Date();
            params.createby = params.updateby;
            var insertKeyword = await new Keyword(params);
            insertKeyword.save();
            if (insertKeyword != null) {
                await client.del('listKeyword')
                return {
                    status: true,
                    data: insertKeyword
                };
            } else {
                return {
                    status: false,
                    msg: "Keyword error."
                };
            }
        } else {
            return {
                status: false,
                msg: "Keyword is already present."
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
        const { _id, value, updateby } = params;
        var findOne = await Keyword.findByIdAndUpdate(_id, { $set: { value: value, updatedate: new Date(), updateby: updateby } }, { new: true });
        if (findOne != null) {
            await client.del('listKeyword')
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Keyword is not present."
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
        var deleteOne = await Keyword.findByIdAndDelete(id);
        if (deleteOne != null) {
            await client.del('listKeyword')
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Keyword is not delete."
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