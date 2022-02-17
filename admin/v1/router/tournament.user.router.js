var UserTournament = require('./../controller/tournament.user.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', UserTournament.getTournament);
module.exports = router;