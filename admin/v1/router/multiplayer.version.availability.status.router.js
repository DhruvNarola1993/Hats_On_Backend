var MultiplayerVersion = require('./../controller/multiplayer.version.availability.status.controller');
var express = require('express');
var router = express.Router();
// All 
router.post('/page', MultiplayerVersion.getmultiplayers);
// Insert 
router.post('/', MultiplayerVersion.insertOneMultiplayer);
// Update 
router.put('/:id', MultiplayerVersion.updateOneMultiplayer);
// Delete 
router.delete('/:id', MultiplayerVersion.deleteOneMultiplayer);
module.exports = router;