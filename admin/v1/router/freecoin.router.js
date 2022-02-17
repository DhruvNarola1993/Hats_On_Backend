var Freecoin = require('./../controller/freecoin.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Freecoin.getFreecoins);
// Insert
router.post('/', Freecoin.insertOneFreecoin);
// Update 
router.put('/:id', Freecoin.updateOneFreecoin);
// Delete 
router.delete('/:id', Freecoin.deleteOneFreecoin);
module.exports = router;