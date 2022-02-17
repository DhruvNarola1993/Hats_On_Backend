const { getchat , insertchat, updatechat, deleteonechat} = require('../helper/chat.helper');
// All Data Show in GridView
exports.getChat = async (req, res, next) => {
    var response = await getchat(req.body);
    res.json(response);
};
// Insert
exports.insertOneChat = async (req, res, next) => {
    var response = await insertchat(req.body);
    res.json(response);
};
// Update
exports.updateOneChat = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatechat(req.body);
    res.json(response);
};
// Delete
exports.deleteOneChat = async (req, res, next) => {
    var response = await deleteonechat(req.params);
    res.json(response);
};