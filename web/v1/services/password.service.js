var User = require('./../../../api/v1/models/user.model'); // This is application User
const { checkUser } = require('./login.service');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/***
 * 
 * @deprecated Date - 29-12-2021 Update By Abhineet 
 * 
 */

// Update Password
async function updatePassword(params, payload) {
    try {
        const { oldpassword } = params;
        const { aud } = payload;
        var finduser = await User.findOne({ username: aud }).select({
            mobile: 1, password: 1
        });
        var isMatch = await checkUser(oldpassword, finduser.password);
        if (isMatch.status) {
            var encryptpass = await encryptPassword(params);
            if (encryptpass.status) {
                var updatePassword = await User.findOneAndUpdate({ username: aud }, { $set: { password: encryptpass.encryptPass } }, { "fields": { _id: 0, username: 1 } });
                if(updatePassword != undefined) {
                    return {
                        status: true,
                        msg: "Password is update."
                    };
                } else {
                    return {
                        status: false,
                        msg: "Password is not update."
                    };
                }
                
            } else {
                return encryptpass;
            }
        } else {
            return {
                status: false,
                msg: "Your current password is not match."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Update Password
async function updatepasswordUser(params, payload) {
    try {
        const { newpassword, otp } = params;
        if (otp == "1234") {
            const { aud } = payload;
            const bcryptSalt = await bcrypt.genSalt(10);
            const bcryptHash = await bcrypt.hash(newpassword, bcryptSalt);
            var userUpdatePassword = await User
                    .findOneAndUpdate({ username: aud }, { $set: { password: bcryptHash } }, { new: true, "fields": { _id: 0 } });
            if (userUpdatePassword != null) {
                return {
                    status: true,
                    msg: "Password update successfully."
                };
            } else {
                return {
                    status: false,
                    msg: "Password is not modify."
                };
            }
        } else {
            return {
                status: false,
                msg: "OTP is invalid.Please try again."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// Encrypt Password
async function encryptPassword(params) {
    try {
        const { newpassword } = params;
        var genSalt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        genSalt = await bcrypt.hash(newpassword, genSalt);
        if (genSalt != undefined) {
            return {
                status: true,
                encryptPass: genSalt
            };
        } else {
            return {
                status: false,
                msg: "Your password is not encrypted."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { updatePassword, encryptPassword, updatepasswordUser };