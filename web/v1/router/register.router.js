var { registerWeb, verifyWeb, resendotpWeb, forgetpasswordWeb, resetpasswordWeb } = require('./../controller/register.controller');
var express = require('express');
var router = express.Router();
// Register
router.post('/', registerWeb);
// Verify User
router.post('/verify', verifyWeb);
// Resend OTP
router.post('/resendotp', resendotpWeb);
// Forget Password
router.post('/forgetpassword', forgetpasswordWeb);
// Reset Password
router.post('/resetpassword', resetpasswordWeb);
module.exports = router;