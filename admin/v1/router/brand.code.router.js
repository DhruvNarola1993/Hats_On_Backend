var { getList, insertOne, updateOne, deleteOne } = require('./../controller/brand.code.controller');
var express = require('express');
var router = express.Router();
// All Rating Data
router.post('/page', getList);
// Insert Rating
router.post('/', insertOne);
// Update Rating
router.put('/:id', updateOne);
// Delete Rating
router.delete('/:id', deleteOne);
module.exports = router;