var Common = require('./common.controller');
var express = require('express');
var router = express.Router();
// All Data
router.get('/level', Common.getLevelsCombo);
// All Data
router.get('/rate', Common.getRatingsCombo);
// All Tournament
router.get('/tournament', Common.getTournamentsCombo);
// All Star User
router.get('/staruser', Common.getStarUserPanelCombo);
// All User
router.get('/subcribetype', Common.getSubcribesCombo);
// All User
router.get('/point', Common.getPointCombo);
// All Promo Code
router.get('/promo', Common.getPromoCodeCombo);
module.exports = router;