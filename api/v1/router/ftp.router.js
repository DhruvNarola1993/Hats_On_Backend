module.exports = async (io, socket, type) => {
    (await require('../controller/faq.controller')(io, socket)); // Faq Data
    (await require('../controller/termcondition.controller')(io, socket)); // Term and Condition Data
    (await require('../controller/howplay.controller')(io, socket)); // How to play Data

    // (await require('../middleware/socket.disconnect')(io, socket, type)); // disconnect user
};