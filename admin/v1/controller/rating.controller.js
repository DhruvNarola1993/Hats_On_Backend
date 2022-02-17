const { getratings, insertrating, updaterating, deleteonerating } = require('../helper/rating.helper');
// All Rating Data Show in GridView
exports.getRatings = async (req, res, next) => {
    var response = await getratings(req.body);
    res.json(response);
};
// Insert Rating One
exports.insertOneRating = async (req, res, next) => {
    console.log(req.body);
    var response = await insertrating(req.body);
    res.json(response);
};
// Update One Rating
exports.updateOneRating = async (req, res, next) => {
    req.body._id = req.params.id;
    var response = await updaterating(req.body);
    res.json(response);
};
// Delete Rating
exports.deleteOneRating = async (req, res, next) => {
    var response = await deleteonerating(req.params);
    res.json(response);
};