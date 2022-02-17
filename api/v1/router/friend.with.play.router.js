module.exports = async (io, socket) => {
    (await require('../controller/friend.with.play.controller')(io,socket)); // Play with friend

    (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};