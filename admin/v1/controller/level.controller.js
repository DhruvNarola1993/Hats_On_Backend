const { getlevel,  insertlevel, updatelevel, deleteonelevel } = require('../helper/level.helper');
// All Levels Data Show in GridView
exports.getLevels = async (req, res, next) => {
    var response = await getlevel(req.body);
    res.json(response);
};
// Insert Level One
exports.insertOneLevel = async (req, res, next) => {
    var response = await insertlevel(req.body);
    res.json(response);
};
// Update
exports.updateLevel = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatelevel(req.body);
    res.json(response);
};
// Delete
exports.deleteOneLevel = async (req, res, next) => {
    var response = await deleteonelevel(req.params);
    res.json(response);
};