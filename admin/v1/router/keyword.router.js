var Keyword = require('./../controller/keyword.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Keyword.getKeywords);
// Insert
router.post('/', Keyword.insertOneKeyword);
// Update 
router.put('/:id', Keyword.updateOneKeyword);
// Delete 
router.delete('/:id', Keyword.deleteOneKeyword);
module.exports = router;