const { gettournament, updatetournamentcancle,
    inserttournament, updatetournament, deleteonetournament,
    inserttournamentround, updatetournamentround, deleteonetournamentround } = require('../helper/tournament.helper');
// All Data Show in GridView
exports.getTournament = async (req, res, next) => {
    var response = await gettournament(req.body);
    res.json(response);
};
// Insert
exports.insertOneTournament = async (req, res, next) => {
    var response = await inserttournament(req.body);
    res.json(response);
};
// Update
exports.updateOneTournament = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatetournament(req.body);
    res.json(response);
};
// Update
exports.updateTournamentCancle = async (req, res, next) => {
    var response = await updatetournamentcancle(req.body);
    res.json(response);
};
// Delete
exports.deleteOneTournament = async (req, res, next) => {
    var response = await deleteonetournament(req.params);
    res.json(response);
};
// Insert
exports.insertOneTournamentRound = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await inserttournamentround(req.body);
    res.json(response);
};
// Update
exports.updateOneTournamentRound = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updatetournamentround(req.body);
    res.json(response);
};
// Delete
exports.deleteOneTournamentRound = async (req, res, next) => {
    var response = await deleteonetournamentround(req.params);
    res.json(response);
};
