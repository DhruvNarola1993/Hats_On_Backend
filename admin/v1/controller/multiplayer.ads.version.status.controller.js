const { getmultiplayerads, insertmultiplayerads, updatemultiplayerads, deleteonemultiplayerads } = require('../helper/multiplayer.ads.version.status.helper');
// All Levels Data Show in GridView
exports.getmultiplayersads = async (req, res, next) => {
    var response = await getmultiplayerads(req.body);
    res.json(response);
};
// Insert One
exports.insertOneMultiplayerads = async (req, res, next) => {
    var response = await insertmultiplayerads(req.body);
    res.json(response);
};
// Update
exports.updateOneMultiplayerads = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatemultiplayerads(req.body);
    res.json(response);
};
// Delete
exports.deleteOneMultiplayerads = async (req, res, next) => {
    var response = await deleteonemultiplayerads(req.params);
    res.json(response);
};