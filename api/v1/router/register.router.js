module.exports = async (io, socket) => {
  (await require('../controller/register.controller')(io,socket)); // Register and send otp
  (await require('../controller/otp.controller')(io,socket)); // Otp Verify
  (await require('../controller/forgetpassword.controller')(io,socket)); // forget password and send otp and reset new password

  (await require('../controller/invite.controller')(io,socket)); // Invite Friend -- Play With Friend

  // (await require('../middleware/socket.disconnect')(io,socket)); // disconnect user
};