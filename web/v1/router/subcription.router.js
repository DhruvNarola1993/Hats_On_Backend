var { listSubcriptionController, checkMobileStarcodeController } = require('./../controller/subcription.controller');
var { verifyAccessToken } = require('./../middleware/auth.middleware');
var express = require('express');
var router = express.Router();
// List of Subcription List
router.post('/', verifyAccessToken, listSubcriptionController);
// Check Mobile and Star Code - Is Present or Not
router.post('/check', verifyAccessToken, checkMobileStarcodeController);

// Referal Star Code 
module.exports = router;