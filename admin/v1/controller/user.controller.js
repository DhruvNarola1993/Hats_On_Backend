const { getuser, updatelevelratingforuser } = require('../helper/user.helper');
// All Data Show in GridView
exports.getUsers = async (req, res, next) => {
    console.log(req.connection.remoteAddress);
    console.log(req.socket.remoteAddress);
    // console.log(req.connection.socket.remoteAddress);
    var response = await getuser(req.body);
    res.json(response);
};
// Update One
exports.updateOneUserLevelRating = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatelevelratingforuser(req.body);
    res.json(response);
};