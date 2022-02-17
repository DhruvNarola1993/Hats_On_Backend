
var Promo = require('./../../../api/v1/models/user.subcription.model');
var moment = require("moment");
const User = require('../../../api/v1/models/user.model');

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
            countTotal = await Promo.countDocuments({ "username": { "$regex": search, "$options": 'i' } });
            findAll = await Promo.aggregate([
                { $sort: sortObject },
                { $match: { "username": { "$regex": search, "$options": 'i' } } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Promo.countDocuments();
            findAll = await Promo.aggregate([
                { $sort: sortObject },
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
                msg: "User Subcription is not present."
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
        const { _id, userid, subscriptionType, subscriptionid, subscriptionStartDate,netSubscriptionFee,feesandCharges, gstCharges,totalAmountPaid, updateby } = params;
        params.subscriptionPurchaseDate = new Date();
        params.subscriptionStartDate = new Date(subscriptionStartDate);
        if (subscriptionType == "Daily") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(1, "days");
        } else if (subscriptionType == "Weekly") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(7, "days");
        } else if (subscriptionType == "Monthly") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(30, "days");
        } else if (subscriptionType == "Quarterly") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(90, "days");
        } else if (subscriptionType == "Annual") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(365, "days");
        }
        var findOne = await Promo.findByIdAndUpdate(_id, {
            $set: {
                username: userid,
                subscriptionType: subscriptionType,
                subscriptionid: subscriptionid,
                subscriptionPurchaseDate: new Date(),
                subscriptionStartDate: params.subscriptionStartDate,
                subscriptionEndDate: params.subscriptionEndDate,
                updatedate: new Date(),
                netSubscriptionFee: netSubscriptionFee,
                feesandCharges: feesandCharges,
                gstCharges: gstCharges,
                totalAmountPaid: totalAmountPaid,
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
                msg: "User Subcription is not present."
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
        const { updateby, subscriptionStartDate, subscriptionType } = params;
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = updateby;
        params.subscriptionPurchaseDate = new Date();
        params.subscriptionStartDate = new Date(subscriptionStartDate);
        params.username = params.userid;
        if (subscriptionType == "Daily") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(1, "days");
        } else if (subscriptionType == "Weekly") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(7, "days");
        } else if (subscriptionType == "Monthly") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(30, "days");
        } else if (subscriptionType == "Quarterly") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(90, "days");
        } else if (subscriptionType == "Annual") {
            params.subscriptionEndDate = moment(new Date(subscriptionStartDate)).add(365, "days");
        }
        var insertRating = await new Promo(params);
        insertRating = await insertRating.save();
        if (insertRating != null) {
            var sendList = await User.findOne({ username:  params.username }, { connectionid: 1 })  /// isSubcriptionAvalibleStatus
            IO.to(sendList.connectionid).emit('res:isSubcriptionAvalibleStatus', { status: true, isSubcriptionAvalibleStatus: true });
            return {
                status: true,
                data: insertRating
            };
        } else {
            return {
                status: false,
                msg: "User Subcription error."
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
            // var sendList = await User.findOne({ username: username }, { connectionid: 1 })  /// isSubcriptionAvalibleStatus
            // IO.to(sendList.connectionid).emit('res:isSubcriptionAvalibleStatus', { status: true, isSubcriptionAvalibleStatus: false });
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "User Subcription is not delete."
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