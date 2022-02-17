var Subscription = require('./../controller/subscription.controller');
var express = require('express');
var router = express.Router();
// All 
router.post('/page', Subscription.getSubscription);
// Insert 
router.post('/', Subscription.insertOneSubscription);
// Update 
router.put('/:id', Subscription.updateOneSubscription);
// Delete 
router.delete('/:id', Subscription.deleteOneSubscription);
module.exports = router;