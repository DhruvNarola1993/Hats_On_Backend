const { getmultiplayer, insertmultiplayer, updatemultiplayer, deleteonemultiplayer } = require('../helper/multiplayer.version.availability.status.helper');
// All Levels Data Show in GridView
exports.getmultiplayers = async (req, res, next) => {
    var response = await getmultiplayer(req.body);
    res.json(response);
};
// Insert One
exports.insertOneMultiplayer = async (req, res, next) => {
    var response = await insertmultiplayer(req.body);
    res.json(response);
};
// Update
exports.updateOneMultiplayer = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatemultiplayer(req.body);
    res.json(response);
};
// Delete
exports.deleteOneMultiplayer = async (req, res, next) => {
    var response = await deleteonemultiplayer(req.params);
    res.json(response);
};