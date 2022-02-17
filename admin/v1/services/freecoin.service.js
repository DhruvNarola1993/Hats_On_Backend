var Freecoin = require('./../../../api/v1/models/freecoin.model');
// All Data 
async function getAll(params) {
    try {
        const { pageIndex, pageSize } = params;
        var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
        var documentLimit = parseInt(pageSize);
        var countTotal = await Freecoin.countDocuments();
        var findAll = await Freecoin.find().skip(documentSkip).limit(documentLimit).lean();
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
                msg: "Coins is not present."
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
        var insertKeyword = await new Freecoin(params);
        insertKeyword.save();
        if (insertKeyword != null) {
            return {
                status: true,
                data: insertKeyword
            };
        } else {
            return {
                status: false,
                msg: "Free-Coin error."
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
        const { _id, coins } = params;
        var findOne = await Freecoin.findByIdAndUpdate(_id, { $set: { coins: coins, updatedate: new Date() } }, { new: true });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Free-coin is not present."
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
        var deleteOne = await Freecoin.findByIdAndDelete(id);
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Free-coin is not delete."
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