const { getfaq , getfaqone, insertfaq, updatefaq, deleteonefaq} = require('../helper/faq.helper');
// All Data Show in GridView
exports.getFaqs = async (req, res, next) => {
    var response = await getfaq(req.body);
    res.json(response);
};
// Insert
exports.insertOneFaq = async (req, res, next) => {
    var response = await insertfaq(req.body);
    res.json(response);
};
// Update
exports.updateOneFaq = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatefaq(req.body);
    res.json(response);
};
// Delete
exports.deleteOneFaq = async (req, res, next) => {
    var response = await deleteonefaq(req.params);
    res.json(response);
};