var Computercoin = require('../../../api/v1/models/computercoin.model');
const client = require('../../../connection/redisconnection');
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
            countTotal = await Computercoin.countDocuments({ "coins": { "$gt": parseInt(search) } });
            findAll = await Computercoin.aggregate([
                { $sort: sortObject },
                { $match: { "coins": { "$gt": parseInt(search) } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Computercoin.countDocuments();
            findAll = await Computercoin.aggregate([
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
                msg: "Computer-Coins is not present."
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
        const { coins, updateby } = params;
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = updateby;
        var insertKeyword = await new Computercoin(params);
        insertKeyword.save();
        if (insertKeyword != null) {
            await client.del('listHcoin');
            return {
                status: true,
                data: insertKeyword
            };
        } else {
            return {
                status: false,
                msg: "Computer-Coin error."
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
        const { _id, coins, updateby } = params;
        var findOne = await Computercoin.findByIdAndUpdate(_id, { $set: { coins: coins, updatedate: new Date(), updateby: updateby } }, { new: true });
        if (findOne != null) {
            await client.del('listHcoin');
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Computer-coin is not present."
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
        var deleteOne = await Computercoin.findByIdAndDelete(id);
        if (deleteOne != null) {
            await client.del('listHcoin');
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Computer-coin is not delete."
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