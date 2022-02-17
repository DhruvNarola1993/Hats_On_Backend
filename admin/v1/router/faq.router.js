var Faq = require('./../controller/faq.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Faq.getFaqs);
// Insert
router.post('/', Faq.insertOneFaq);
// Update 
router.put('/:id', Faq.updateOneFaq);
// Delete 
router.delete('/:id', Faq.deleteOneFaq);
module.exports = router;