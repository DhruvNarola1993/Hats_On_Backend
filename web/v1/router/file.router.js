var { updateUserProfileFile } = require('./../controller/profile.controller');
var express = require('express');
var router = express.Router();
// Upload File
router.post('/upload', updateUserProfileFile);
module.exports = router;