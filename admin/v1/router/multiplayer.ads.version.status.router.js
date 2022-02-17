var MultiplayerAdsVersion = require('./../controller/multiplayer.ads.version.status.controller');
var express = require('express');
var router = express.Router();
// All 
router.post('/page', MultiplayerAdsVersion.getmultiplayersads);
// Insert 
router.post('/', MultiplayerAdsVersion.insertOneMultiplayerads);
// Update 
router.put('/:id', MultiplayerAdsVersion.updateOneMultiplayerads);
// Delete 
router.delete('/:id', MultiplayerAdsVersion.deleteOneMultiplayerads);
module.exports = router;