var Multiplayer = require('./../../../api/v1/models/multiplayer.version.availability.status.model');
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
            countTotal = await Multiplayer.countDocuments({ "name": { "$regex": search, "$options": 'i' } });
            findAll = await Multiplayer.aggregate([
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
            countTotal = await Multiplayer.countDocuments();
            findAll = await Multiplayer.aggregate([
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
                msg: "Multiplayer-Version-Availability-Status is not present."
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
// Insert
async function insertOne(params) {
    try {
        const { name, updateby, startdate, enddate } = params;
        var countKeyword = await Multiplayer.countDocuments({ name: name });
        if (countKeyword == 0) {
            params.createdate = new Date();
            params.updatedate = new Date();
            params.createby = updateby;
            var insertKeyword = await new Multiplayer(params);
            insertKeyword.save();
            if (insertKeyword != null) {
                return {
                    status: true,
                    data: insertKeyword
                };
            } else {
                return {
                    status: false,
                    msg: "Multiplayer-Version-Availability-Status error."
                };
            }
        } else {
            return {
                status: false,
                msg: "Multiplayer-Version-Availability-Status is already present."
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
        const { _id, name, updateby, startdate, enddate } = params;
        var findOne = await Multiplayer.findByIdAndUpdate(_id, { $set: { name: name, updatedate: new Date(), updateby: updateby, startdate: startdate, enddate: enddate } }, { new: true });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Multiplayer-Version-Availability-Status is not present."
            };
        }
    } catch (error) {
        console.log(error)
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
        var deleteOne = await Multiplayer.findByIdAndDelete(id);
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Multiplayer-Version-Availability-Status is not delete."
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