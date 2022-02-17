var { getList, updateOne, deleteOne, insertOne } = require('./../controller/user.subcription.controller');
var express = require('express');
var router = express.Router();
// Upload File And With Delete - Old File
router.post('/', insertOne);
// New File Upload
router.put('/:id', updateOne);
// Delete File
router.delete('/:id', deleteOne);
// List of File
router.post('/page', getList);
module.exports = router;