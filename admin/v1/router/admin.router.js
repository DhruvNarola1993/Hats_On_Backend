var Admin = require('./../controller/admin.controller');
var express = require('express');
var router = express.Router();
// Login
router.post('/', Admin.loginAdmin);
// Update 
router.put('/:id', Admin.updateAdmin);
// One Data
router.get('/:id', Admin.getAdminOne);
module.exports = router;