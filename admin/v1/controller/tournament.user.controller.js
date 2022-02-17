const { gettournament } = require('../helper/tournament.user.controller');
// All Data Show in GridView
exports.getTournament = async (req, res, next) => {
    var response = await gettournament(req.body);
    res.json(response);
};