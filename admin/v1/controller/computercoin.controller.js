const { getcomputercoin, insertcomputercoin, updatecomputercoin, deleteonecomputercoin } = require('../helper/computercoin.helper');
// All Data Show in GridView
exports.getComputercoins = async (req, res, next) => {
    var response = await getcomputercoin(req.body);
    res.json(response);
};
// Insert One
exports.insertOneComputercoin = async (req, res, next) => {
    var response = await insertcomputercoin(req.body);
    res.json(response);
};
// Update
exports.updateOneComputercoin = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatecomputercoin(req.body);
    res.json(response);
};
// Delete
exports.deleteOneComputercoin = async (req, res, next) => {
    var response = await deleteonecomputercoin(req.params);
    res.json(response);
};