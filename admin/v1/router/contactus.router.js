var Contact = require('./../controller/contactus.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Contact.getContacts);
module.exports = router;