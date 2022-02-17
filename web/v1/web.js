var express = require('express');
var router = express.Router();
// Date -- 20/09/2021 
/*---- Login Module ----*/ 
var loginRoute = require('./router/login.router');
router.use('/login', loginRoute);
// Date -- 21/09/2021 
/*---- Register Module ----*/ 
var registerRoute = require('./router/register.router');
router.use('/register', registerRoute);
// Date -- 22/09/2021 
/*---- Password Module ----*/ 
var passwordRoute = require('./router/password.router');
router.use('/password', passwordRoute);
// Date -- 23/09/2021 
/*---- File Upload Module ----*/ 
var fileuploadRoute = require('./router/file.router');
router.use('/file', fileuploadRoute);
// Date -- 23/09/2021 
/*---- Subcription Module ----*/ 
var subcriptionRoute = require('./router/subcription.router');
router.use('/subcription', subcriptionRoute);


// Date -- 23/09/2021 
/*---- Profile Update List ----*/ 
var profileRoute = require('./router/profile-update.router');
router.use('/profile', profileRoute);


// var subcriptionRoute = require('./router/subcription.router');
// router.use('/subcription', subcriptionRoute);
// Middleware
router.use(function (req, res, next) {
    var err = {};
    err.status = 404;
    err.msg = "Not Found";
    next(res.status(404).json(err));
});
module.exports = router;