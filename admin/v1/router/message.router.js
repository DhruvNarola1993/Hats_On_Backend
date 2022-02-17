var Message = require('./../controller/message.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Message.getMessage);
// Insert
router.post('/', Message.insertOneMessage);
// Update 
router.put('/:id', Message.updateOneMessage);
// Delete 
router.delete('/:id', Message.deleteOneMessage);
module.exports = router;