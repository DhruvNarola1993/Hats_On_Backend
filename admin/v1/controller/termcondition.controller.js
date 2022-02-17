const { getterm, insertterm, updateterm, deleteoneterm } = require('../helper/termcondition.helper');
// All Data Show in GridView
exports.getTerm = async (req, res, next) => {
    var response = await getterm(req.body);
    res.json(response);
};
// Insert
exports.insertOneTerm = async (req, res, next) => {
    var response = await insertterm(req.body);
    res.json(response);
};
// Update
exports.updateOneTerm = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updateterm(req.body);
    res.json(response);
};
// Delete
exports.deleteOneTerm = async (req, res, next) => {
    var response = await deleteoneterm(req.params);
    res.json(response);
};