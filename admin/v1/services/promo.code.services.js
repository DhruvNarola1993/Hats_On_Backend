
var Promo = require('./../../../api/v1/models/promo.code.model');

// Promo Code
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
            countTotal = await Promo.countDocuments({ "promocode": { "$regex": search, "$options": 'i' } });
            findAll = await Promo.aggregate([
                { $sort: sortObject },
                { $match: { "promocode": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "subscriptions", localField: "subcriptiontype", foreignField: "_id", as: "documentNew" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$documentNew", 0] }, "$$ROOT"] } }
                },
                { $project: { documentNew: 0 } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Promo.countDocuments();
            findAll = await Promo.aggregate([
                { $sort: sortObject },
                { $lookup: { from: "subscriptions", localField: "subcriptiontype", foreignField: "_id", as: "documentNew" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$documentNew", 0] }, "$$ROOT"] } }
                },
                { $project: { documentNew: 0 } },
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
                msg: "Promo is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Promo Code One Update
async function getUpdateOne(params) {
    try {
        const { _id, promocode, discount, startdate, enddate, subcriptiontype, updateby } = params;
        var findOne = await Promo.findByIdAndUpdate(_id, {
            $set: {
                promocode: promocode,
                discount: discount,
                startdate: startdate,
                enddate: enddate,
                subcriptiontype: subcriptiontype,
                updatedate: new Date(),
                updateby: updateby
            }
        }, { new: true });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Promo is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Promo Code Instert One
async function insertOne(params) {
    try {
        const { promocode, updateby } = params;
        var countRating = await Promo.countDocuments({ promocode: promocode });
        if (countRating == 0) {
            params.createdate = new Date();
            params.updatedate = new Date();
            params.createby = updateby;
            var insertRating = await new Promo(params);
            insertRating = await insertRating.save();
            if (insertRating != null) {
                return {
                    status: true,
                    data: insertRating
                };
            } else {
                return {
                    status: false,
                    msg: "Promo error."
                };
            }
        } else {
            return {
                status: false,
                msg: "Promo is already present."
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
        var deleteOne = await Promo.findByIdAndDelete(id);
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Promo is not delete."
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