module.exports = async (io, socket) => {
    (await require('../controller/computerplay.controller')(io,socket)); // Play with computer

    // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};