var Term = require('./../controller/termcondition.controller');
var express = require('express');
var router = express.Router();
// All Data
router.post('/page', Term.getTerm);
// Insert
router.post('/', Term.insertOneTerm);
// Update 
router.put('/:id', Term.updateOneTerm);
// Delete 
router.delete('/:id', Term.deleteOneTerm);
module.exports = router;