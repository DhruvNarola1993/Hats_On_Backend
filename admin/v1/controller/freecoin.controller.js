const { getfreecoin, insertfreecoin, updatefreecoin, deleteonefreecoin } = require('../helper/freecoin.helper');
// All Data Show in GridView
exports.getFreecoins = async (req, res, next) => {
    var response = await getfreecoin(req.body);
    res.json(response);
};
// Insert One
exports.insertOneFreecoin = async (req, res, next) => {
    var response = await insertfreecoin(req.body);
    res.json(response);
};
// Update
exports.updateOneFreecoin = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatefreecoin(req.body);
    res.json(response);
};
// Delete
exports.deleteOneFreecoin = async (req, res, next) => {
    var response = await deleteonefreecoin(req.params);
    res.json(response);
};