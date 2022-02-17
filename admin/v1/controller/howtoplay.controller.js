const { gethowtoplay, inserthowtoplay, updatehowtoplay, deleteonehowtoplay} = require('../helper/howtoplay.helper');
// All Data Show in GridView
exports.getHowtoplay = async (req, res, next) => {
    var response = await gethowtoplay(req.body);
    res.json(response);
};
// Insert
exports.insertOneHowtoplay = async (req, res, next) => {
    var response = await inserthowtoplay(req.body);
    res.json(response);
};
// Update
exports.updateOneHowtoplay = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatehowtoplay(req.body);
    res.json(response);
};
// Delete
exports.deleteOneHowtoplay = async (req, res, next) => {
    var response = await deleteonehowtoplay(req.params);
    res.json(response);
};