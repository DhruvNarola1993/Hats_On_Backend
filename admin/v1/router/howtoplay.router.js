var Howtoplay = require('./../controller/howtoplay.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Howtoplay.getHowtoplay);
// Insert
router.post('/', Howtoplay.insertOneHowtoplay);
// Update 
router.put('/:id', Howtoplay.updateOneHowtoplay);
// Delete 
router.delete('/:id', Howtoplay.deleteOneHowtoplay);
module.exports = router;