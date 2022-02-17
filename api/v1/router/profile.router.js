module.exports = async (io, socket) => {
    (await require('../controller/profile.controller')(io,socket)); // Profile Update name, lastname, email, dob, gender
    (await require('../controller/setting.controller')(io,socket)); // Profile Update name, lastname, email, dob, gender

    // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};