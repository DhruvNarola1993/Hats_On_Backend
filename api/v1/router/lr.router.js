module.exports = async (io, socket) => {
    (await require('../controller/rating.controller')(io,socket)); // Rating
    (await require('../controller/level.controller')(io,socket)); // Level

    // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};