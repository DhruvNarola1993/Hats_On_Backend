var { getTournament, updateOne, deleteOne, insertOne } = require('./../controller/tournament.star.panel.controller');
var express = require('express');
var router = express.Router();
// Upload File And With Delete - Old File
router.post('/', insertOne);
// New File Upload
router.put('/:id', updateOne);
// Delete File
router.delete('/:id', deleteOne);
// List of File
router.post('/page', getTournament);
module.exports = router;