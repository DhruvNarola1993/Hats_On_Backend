const { getsubscription, insertsubscription, updatesubscription, deleteonesubscription } = require('../helper/subscription.helper');
// All Levels Data Show in GridView
exports.getSubscription = async (req, res, next) => {
    var response = await getsubscription(req.body);
    res.json(response);
};
// Insert One
exports.insertOneSubscription = async (req, res, next) => {
    var response = await insertsubscription(req.body);
    res.json(response);
};
// Update
exports.updateOneSubscription = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatesubscription(req.body);
    res.json(response);
};
// Delete
exports.deleteOneSubscription = async (req, res, next) => {
    var response = await deleteonesubscription(req.params);
    res.json(response);
};