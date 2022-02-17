const client = require('../../../connection/redisconnection');
var Chat = require('./../../../api/v1/models/chat.model');
// Chat All Data 
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
            countTotal = await Chat.countDocuments({ "question": { "$regex": search, "$options": 'i' } });
            findAll = await Chat.aggregate([
                { $sort: sortObject },
                { $match: { "question": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Chat.countDocuments();
            findAll = await Chat.aggregate([
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
                msg: "Chat is not present."
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
        var insertChat = await new Chat(params);
        insertChat.save();
        if (insertChat != null) {
            await client.del('listchat')
            return {
                status: true,
                data: insertChat
            };
        } else {
            return {
                status: false,
                msg: "Chat error."
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
        const { _id, question, answer, updateby } = params;
        var findOne = await Chat.findByIdAndUpdate(_id, { $set: { question: question, answer: answer, updatedate: new Date(), updateby: updateby } }, { new: true });
        if (findOne != null) {
            await client.del('listchat')
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Chat is not present."
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
        var deleteOne = await Chat.findByIdAndDelete(id);
        if (deleteOne != null) {
            await client.del('listchat')
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Chat is not delete."
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