const { getlevelcombo, getratingcombo, gettournamentcombo, getstarusercombo, getsubcriptiondemo, getpointcombo, getstaruserpanelcombo, getpromocodecombo } = require('./common.helper');
// All Data Show in SelectView
exports.getLevelsCombo = async (req, res, next) => {
    var response = await getlevelcombo();
    res.json(response);
};
// All Data Show in SelectView
exports.getRatingsCombo = async (req, res, next) => {
    var response = await getratingcombo();
    res.json(response);
};
// All Data Show in SelectView
exports.getTournamentsCombo = async (req, res, next) => {
    var response = await gettournamentcombo();
    res.json(response);
};
// All Data Show in SelectView
exports.getStarUsersCombo = async (req, res, next) => {
    var response = await getstarusercombo();
    res.json(response);
};
// All Data Show in SelectView
exports.getSubcribesCombo = async (req, res, next) => {
    var response = await getsubcriptiondemo();
    res.json(response);
};

// All Data Show in SelectView
exports.getPointCombo = async (req, res, next) => {
    var response = await getpointcombo();
    res.json(response);
};


// All Data Show in SelectView
exports.getStarUserPanelCombo = async (req, res, next) => {
    var response = await getstaruserpanelcombo();
    res.json(response);
};

// All Data Show in SelectView
exports.getPromoCodeCombo = async (req, res, next) => {
    var response = await getpromocodecombo();
    res.json(response);
};
