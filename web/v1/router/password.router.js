var { updatepasswordWeb, sendOtpForUpdatePassword } = require('./../controller/password.controller');
var { verifyAccessToken } = require('./../middleware/auth.middleware');
var express = require('express');
var router = express.Router();
// Update
router.put('/', verifyAccessToken, updatepasswordWeb);
// Send Otp
router.post('/', verifyAccessToken, sendOtpForUpdatePassword);
module.exports = router;