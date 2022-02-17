const { getmessage, updatemessage, insertmessage, deleteonemessage } = require('../helper/message.helper');
// All Data Show in GridView
exports.getMessage = async (req, res, next) => {
    var response = await getmessage(req.body);
    res.json(response);
};
// Insert
exports.insertOneMessage = async (req, res, next) => {
    var response = await insertmessage(req.body);
    res.json(response);
};
// Update
exports.updateOneMessage = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatemessage(req.body);
    res.json(response);
};
// Delete
exports.deleteOneMessage = async (req, res, next) => {
    var response = await deleteonemessage(req.params);
    res.json(response);
};