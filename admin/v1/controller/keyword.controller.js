const { getkeyword, insertkeyword, updatekeyword, deleteonekeyword } = require('../helper/keyword.helper');
// All Data Show in GridView
exports.getKeywords = async (req, res, next) => {
    var response = await getkeyword(req.body);
    res.json(response);
};
// Insert One
exports.insertOneKeyword = async (req, res, next) => {
    var response = await insertkeyword(req.body);
    res.json(response);
};
// Update
exports.updateOneKeyword = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatekeyword(req.body);
    res.json(response);
};
// Delete
exports.deleteOneKeyword = async (req, res, next) => {
    var response = await deleteonekeyword(req.params);
    res.json(response);
};