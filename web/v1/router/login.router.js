var { loginWeb, refreshtokenWeb, logoutWeb } = require('./../controller/login.controller');
var express = require('express');
var router = express.Router();
// Login
router.post('/', loginWeb);
// Login -- Refresh Token
router.post('/refreshtoken', refreshtokenWeb);
// LogOut
router.delete('/', logoutWeb);
module.exports = router;