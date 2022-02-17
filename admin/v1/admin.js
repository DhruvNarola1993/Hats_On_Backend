var express = require('express');
var router = express.Router();
// Date -- 14/09/2021 
/*---- Keyword Module ----*/
var keywordRoute = require('./router/keyword.router');
router.use('/keyword', keywordRoute);
// Date -- 14/09/2021 
/*---- Faq Module ----*/
var faqRoute = require('./router/faq.router');
router.use('/faq', faqRoute);
// Date -- 16/09/2021 
/*---- Term-and-Condtion Module ----*/
var termRoute = require('./router/termcondition.router');
router.use('/term', termRoute);
// Date -- 16/09/2021
/*---- How-To-Play Module ----*/
var howtoplayRoute = require('./router/howtoplay.router');
router.use('/play', howtoplayRoute);
// Date -- 16/09/2021
/*---- Rating Module ----*/
var ratingRoute = require('./router/rating.router');
router.use('/rating', ratingRoute);
// Date -- 16/09/2021
/*---- Level Module ----*/
var levelRoute = require('./router/level.router');
router.use('/level', levelRoute);
// Date -- 16/09/2021
/*---- Computer With Play Module ----*/
var computercoinRoute = require('./router/computercoin.router');
router.use('/computer', computercoinRoute);
// Date -- 16/09/2021
/*---- Message Module ----*/
var messageRoute = require('./router/message.router');
router.use('/message', messageRoute);
// Date -- 16/09/2021 
/*---- Multiplayer-Tournament-Play with friend Module ----*/
var multiplayerRoute = require('./router/multiplayer.version.availability.status.router');
router.use('/multiplayer', multiplayerRoute);
// Date -- 16/09/2021 
/*---- Multiplayer-Tournament-Play-Ads with friend Module ----*/
var multiplayeradsRoute = require('./router/multiplayer.ads.version.status.router');
router.use('/multiplayerads', multiplayeradsRoute);
// Date -- 16/09/2021 
/*---- Subcription Module ----*/
var subscriptionRoute = require('./router/subscription.router');
router.use('/subscription', subscriptionRoute);
// Date -- 21/09/2021 
/*---- Common Module ----*/
var commonRoute = require('./common/common.router');
router.use('/common', commonRoute);
// Date -- 24/09/2021 
/*---- User Module ----*/
var userRoute = require('./router/user.router');
router.use('/user', userRoute);
// Date -- 11/10/2021 
/*---- Tournament Module ----*/
var tournamentRoute = require('./router/tournament.router');
router.use('/tournament', tournamentRoute);
// Date -- 11/10/2021 
/*---- Tournament Register User Module ----*/
var tournamentregisterRoute = require('./router/tournament.user.router');
router.use('/tournamentregister', tournamentregisterRoute);
// Date -- 21/10/2021 
/*---- Tournament Panel Module ----*/
var tournamentpanelRoute = require('./router/tournament.panel.controller');
router.use('/tournamentpanel', tournamentpanelRoute);
// Date -- 21/10/2021 
/*---- Tournament Win Module ----*/
var tournamentwinRoute = require('./router/tournament.winner.router');
router.use('/tournamentwin', tournamentwinRoute);
/*---- Conatct-us Module ----*/
var contactRoute = require('./router/contactus.router');
router.use('/contact', contactRoute);
/*---- Admin Module ----*/
var adminRoute = require('./router/admin.router');
router.use('/admin', adminRoute);

// Date -- 21/10/2021 
/*---- Promo Code Module ----*/
var promocodeRoute = require('./router/promo.code.router');
router.use('/promocode', promocodeRoute);

// Date -- 21/10/2021 
/*---- Brand Code Module ----*/
var brandcodeRoute = require('./router/brand.code.router');
router.use('/brandcode', brandcodeRoute);

// Date -- 21/10/2021 
/*---- Chat Code Module ----*/
var chatRoute = require('./router/chat.router');
router.use('/chat', chatRoute);

// Date -- 21/10/2021 
/*---- Hording Module ----*/
var hordingRoute = require('./router/hording.router');
router.use('/hording', hordingRoute);

/*---- USER SUBCRIPTION API Module ----*/
var userSubcriptionRoute = require('./router/user.subcription.router');
router.use('/usersubcription', userSubcriptionRoute);

// Middleware
router.use(function(req, res, next) {
    var err = {};
    err.status = 404;
    err.msg = "Not Found";
    next(res.status(404).json(err));
});
module.exports = router;
