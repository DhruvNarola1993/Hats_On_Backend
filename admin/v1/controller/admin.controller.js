const { loginadmin, updateadmin, getadminone } = require('../helper/admin.helper');
// Login
exports.loginAdmin = async (req, res, next) => {
    console.log(req.body);
    var response = await loginadmin(req.body);
    res.json(response);
};
// Update
exports.updateAdmin = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updateadmin(req.body);
    res.json(response);
};
// Get
exports.getAdminOne = async (req, res, next) => {
    var response = await getadminone(req.params);
    res.json(response);
};