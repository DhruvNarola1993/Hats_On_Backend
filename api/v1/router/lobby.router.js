module.exports = async (io, socket) => {
    (await require('../controller/lobby.controller')(io,socket)); // Create Room with matchmaking

    // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};