var mongoose = require('mongoose');
const User = require('./user.model');
var Schema = mongoose.Schema;
var otpSchema = new Schema({
    otp: {
        type: String,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    },
    mobile: { type: String, ref: "User" },
    otptype: { type: Boolean, default: true },// Register (true) / Forget (false)
    createdate: { type: Date, expireAfterSeconds: 900 }
}, { strict: false, versionKey: false, capped: false });

var Otp = mongoose.model('OTP', otpSchema);
module.exports = Otp;