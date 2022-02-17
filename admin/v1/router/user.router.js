var User = require('./../controller/user.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', User.getUsers);
// Update Rating
router.put('/:id', User.updateOneUserLevelRating);
module.exports = router;