var Level = require('./../controller/level.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Level.getLevels);
// Insert
router.post('/', Level.insertOneLevel);
// Update 
router.put('/:id', Level.updateLevel);
// Delete 
router.delete('/:id', Level.deleteOneLevel);
module.exports = router;