var Chat = require('./../controller/chat.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Chat.getChat);
// Insert
router.post('/', Chat.insertOneChat);
// Update 
router.put('/:id', Chat.updateOneChat);
// Delete 
router.delete('/:id', Chat.deleteOneChat);
module.exports = router;