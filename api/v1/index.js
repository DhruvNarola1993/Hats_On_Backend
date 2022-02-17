module.exports = (IO) => {
    const registerRouter = require("./router/register.router");
    const loginRouter = require('./router/login.router');
    const profileRouter = require('./router/profile.router');
    const contactusRouter = require('./router/contactus.router');

    const ftpRouter = require('./router/ftp.router');
    const lrRouter = require('./router/lr.router');
    const roomRouter = require('./router/lobby.router');
    const keywordRouter = require('./router/keyword.router');

    const computerplayRouter = require('./router/computerplay.router');

    const playwithfriendRouter = require('./router/friend.with.play.router');

    const tournamentRouter = require('./router/tournament.router');

    const onConnection = (socket) => {
        // Online Register (Social {Facebook, Google}, Custom) , Verify User , Forget password, SMS OTP Service 
        registerRouter(IO, socket);
        // Login (Social {Facebook, Google}, Custom) 
        loginRouter(IO, socket);
        // User Profile and Update data -- but email is unique ***** User Setting update 
        profileRouter(IO, socket);
        // Contact Us From User To Admin
        contactusRouter(IO, socket);
        // Faq ***** Terms & Condition ***** How TO Play 
        ftpRouter(IO, socket);
        // Level ***** Rating
        lrRouter(IO, socket);
        // Lobby ***** Room
        roomRouter(IO, socket);
        // Keyword
        keywordRouter(IO, socket);
        // Play With Computer
        computerplayRouter(IO, socket);
        // Play With Friend
        playwithfriendRouter(IO, socket);
        // Tournament
        tournamentRouter(IO,socket);     
    };

    IO.on("connection", onConnection);
};
