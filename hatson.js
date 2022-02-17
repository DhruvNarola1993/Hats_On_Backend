_common = module.exports = require('./config/socketSendRecevice');
require('dotenv').config();
const app = require('./connection/expressconnction');
const http = require('http');
require('./connection/mongooconnection');
require('./connection/redisconnection');
require('./api/v1/common/common.cron.job');
const PORT = 6051;
// Http Server 
var httpServer = http.createServer(app);
IO = module.exports = require('socket.io')(httpServer);
httpServer.listen(PORT, () => {
  console.log("HTTP Server running on port ", `${PORT}`);
});

require('./api/v1/index')(IO);


// Setting - 
// how to play
// terms and condition
// faq

// Refercode (Register)
// ProfilePic (Upload)
// Help
// Redeem 