
var Brand = require('./../../../api/v1/models/brand.code.model');

// Promo Code
async function getAll(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search, brandType } = params;
        var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
        var documentLimit = parseInt(pageSize);
        var countTotal = 0;
        var sortorder = sortOrder == "desc" ? -1 : 1; // Server Get Point Order asc or desc  
        var sortkey = sortKey;
        var sortObject = {};
        sortObject[sortkey] = sortorder;
        var findAll;
        if (search != "") {
            countTotal = await Brand.countDocuments({ "brandcode": { "$regex": search, "$options": 'i' }, brandType: brandType });
            findAll = await Brand.aggregate([
                { $sort: sortObject },
                { $lookup: { from: "subscriptions", localField: "subcriptiontype", foreignField: "_id", as: "documentNew" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$documentNew", 0] }, "$$ROOT"] } }
                },
                { $match: { "brandcode": { "$regex": search, "$options": 'i' }, brandType: brandType } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Brand.countDocuments({ brandType: brandType });
            findAll = await Brand.aggregate([
                { $sort: sortObject },
                { $lookup: { from: "subscriptions", localField: "subcriptiontype", foreignField: "_id", as: "documentNew" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$documentNew", 0] }, "$$ROOT"] } }
                },
                { $match: { brandType: brandType } },
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
                msg: "Brand is not present."
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
        const { _id, startdate, enddate, brandcode, updateby, brandType } = params;
        var findOne;
        if (brandType == "SUBCRIPTION") {
            const { subcriptiontype } = params;
            findOne = await Brand.findByIdAndUpdate(_id, {
                $set: {
                    brandcode: brandcode,
                    startdate: startdate,
                    enddate: enddate,
                    subcriptiontype: subcriptiontype,
                    updatedate: new Date(),
                    updateby: updateby
                }
            }, { new: true });
        } else {
            const { pointbasedType } = params;
            findOne = await Brand.findByIdAndUpdate(_id, {
                $set: {
                    brandcode: brandcode,
                    startdate: startdate,
                    enddate: enddate,
                    pointbasedType: pointbasedType,
                    updatedate: new Date(),
                    updateby: updateby
                }
            }, { new: true });
        }

        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Brand is not present."
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
        const { brandcode, updateby } = params;
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = updateby;
        var insertRating = await new Brand(params);
        insertRating = await insertRating.save();
        if (insertRating != null) {
            return {
                status: true,
                data: insertRating
            };
        } else {
            return {
                status: false,
                msg: "Brand error."
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
        var deleteOne = await Brand.findByIdAndDelete(id);
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Brand is not delete."
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