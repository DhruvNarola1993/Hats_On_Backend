var Computercoin = require('../controller/computercoin.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Computercoin.getComputercoins);
// Insert
router.post('/', Computercoin.insertOneComputercoin);
// Update 
router.put('/:id', Computercoin.updateOneComputercoin);
// Delete 
router.delete('/:id', Computercoin.deleteOneComputercoin);
module.exports = router;