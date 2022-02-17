
var Hording = require('./../../../api/v1/models/hording.model');

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
            countTotal = await Hording.countDocuments({ "brandcode": { "$regex": search, "$options": 'i' } });
            findAll = await Hording.aggregate([
                { $sort: sortObject },
                { $match: { "brandcode": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Hording.countDocuments({});
            findAll = await Hording.aggregate([
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
                msg: "Hording is not present."
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
        const { _id, updateby, imageurl } = params;
        var findOne = await Hording.findByIdAndUpdate(_id, {
            $set: {
                hording: imageurl,
                updatedate: new Date(),
                updateby: updateby
            }
        });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Hording is not present."
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
        const { updateby, imageurl } = params;
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = updateby;
        params.hording = imageurl;
        delete params.imageurl;
        var insertRating = await new Hording(params);
        insertRating = await insertRating.save();
        if (insertRating != null) {
            return {
                status: true,
                data: insertRating
            };
        } else {
            return {
                status: false,
                msg: "Hording error."
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
        var deleteOne = await Hording.findByIdAndDelete(id);
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Hording is not delete."
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