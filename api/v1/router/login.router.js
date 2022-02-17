module.exports = async (io, socket) => {
    (await require('../controller/login.controller')(io,socket)); // Login with custom and social

    // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};