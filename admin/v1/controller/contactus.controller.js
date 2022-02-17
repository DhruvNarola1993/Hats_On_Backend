const { getcontact } = require('../helper/contactus.helper');
// All Data Show in GridView
exports.getContacts = async (req, res, next) => {
    var response = await getcontact(req.body);
    res.json(response);
};