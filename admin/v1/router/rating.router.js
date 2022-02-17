var Rating = require('./../controller/rating.controller');
var express = require('express');
var router = express.Router();
// All Rating Data
router.post('/page', Rating.getRatings);
// Insert Rating
router.post('/', Rating.insertOneRating);
// Update Rating
router.put('/:id', Rating.updateOneRating);
// Delete Rating
router.delete('/:id', Rating.deleteOneRating);
module.exports = router;