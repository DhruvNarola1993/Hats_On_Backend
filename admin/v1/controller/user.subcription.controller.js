const { insertone, getall, updateone, deleteone } = require('../helper/user.subcription.helper');
// 
exports.getList = async (req, res, next) => {
    var response = await getall(req.body);
    res.json(response);
};
// 
exports.insertOne = async (req, res, next) => {
    console.log(req.body);
    var response = await insertone(req.body);
    res.json(response);
};
// 
exports.updateOne = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updateone(req.body);
    res.json(response);
};
// Delete 
exports.deleteOne = async (req, res, next) => {
    var response = await deleteone(req.params);
    res.json(response);
};