module.exports = async (io, socket) => {
    (await require('../controller/tournament.common.controller')(io,socket)); // Play with friend


    // Admin Setup Winner List for Tournament
    (await require('../controller/tournament.win.controller')(io,socket));
    // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};