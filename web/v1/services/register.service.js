var User = require('./../../../api/v1/models/user.model'); // This is application User
var Otp = require('./../../../api/v1/models/otp.model');
const {
    signAccessToken,
    signRefreshToken
} = require('./../middleware/auth.middleware');
const {
    encryptPassword
} = require('./password.service');
const Keyword = require('../../../api/v1/models/keyword.model');

/// Custom Register For User on Web Side
async function customCountUser(params) {
    try {
        const { mobile } = params;
        var countUser = await User.countDocuments({ mobile: mobile });
        if (countUser == 0) {
            return {
                status: true
            };
        } else if (countUser == 1) {
            var getUser = await User.findOne({ mobile: mobile }, { isverify: 1 });
            if (getUser.isverify) {
                return {
                    status: false,
                    code: 0,
                    msg: "Mobile number already registered. Please sign in."
                };
            } else {
                await User.deleteOne({ mobile: mobile });
                return {
                    status: true
                };
            }
        } else {
            return {
                status: false,
                msg: "Mobile number already registered. Please sign in."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Custom Register For User on Web Side
async function socialCountUser(params) {
    try {
        const { mobile, userid } = params;
        var countUser = await User.countDocuments({ $or: [{ mobile: mobile }, { userid: userid }] });
        if (countUser == 0) {
            return {
                status: true
            };
        } else if (countUser == 1) {
            var getUser = await User.findOne({ mobile: mobile }, { isverify: 1 });
            if (getUser.isverify) {
                return {
                    status: false,
                    code: 0,
                    msg: "Mobile number already registered. Please sign in."
                };
            } else {
                await User.deleteOne({ mobile: mobile });
                return {
                    status: true
                };
            }
        } else {
            return {
                status: false,
                code: 0,
                msg: "Mobile number already registered. Please sign in."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}
// Register
async function getCustomeRegister(params) {
    try {
        const { mobile } = params;
        var countuser = await User.countDocuments({ mobile: mobile });
        if (countuser == 0) {
            if (params.referencecode != undefined) {
                if (params.referencecode.trim() != "") {
                    var countRefer = await getReferCode(params);
                    if (countRefer.status) {
                        // If user is Star User
                        if (countRefer.referData.isuserstartype) {
                            params.referencecode = null;
                            params.referencestarcode = countRefer.referData.usercode;
                        } else {
                            params.referencecode = params.referencecode;
                            params.referencestarcode = countRefer.referData.referencestarcode;
                        }
                    } else {
                        params.referencecode = null;
                        params.referencestarcode = null;
                    }
                } else {
                    params.referencecode = null;
                }
            }
            params.online = false;
            params.devicetype = "WEB";
            var insertUser = await new User(params);
            var getInsertUser = await insertUser.save();
            if (getInsertUser != undefined) {
                params.otptype = true;
                var sendOneTimePassword = await sendOtp(params);
                if (sendOneTimePassword.status) {
                    return {
                        status: true,
                        code: 1,
                        msg: "Waiting for Verify User and create otp.",
                        issocial: insertUser.issocial
                    };
                } else {
                    return {
                        status: false,
                        code: 2,
                        msg: "Please Resend OTP.",
                        issocial: insertUser.issocial
                    };
                }
            } else {
                return {
                    status: false,
                    msg: "Error on register."
                };
            }
        } else {
            countuser = await User.findOne({ mobile: mobile });
            if (countuser != undefined) {
                if (countuser.isverify) {
                    return {
                        status: false,
                        code: 0,
                        msg: "Mobile number is register.Please login."
                    };
                } else {
                    await User.deleteOne({ mobile: mobile });
                    return {
                        status: true,
                        code: 1,
                        msg: "Waiting for Verify User and create otp.",
                        issocial: countuser.issocial
                    };
                }
            } else {
                return {
                    status: false,
                    code: 0,
                    msg: "Something Wrong."
                };
            }
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

async function saveUser(params) {
    try {
        var sendOneTimePassword = await sendOtp(params);
        if (sendOneTimePassword.status) {
            delete params.otptype;
            if (params.logintype != undefined) {
                if (params.logintype.toUpperCase() == "FACEBOOK") {
                    if (params.friendfacebook != undefined) {
                        if (params.friendfacebook != '') {
                            var splitFriend = params.friendfacebook;
                            var splitData = splitFriend.split(',');
                            if (splitData.length > 0) {
                                var friendList = await getFriends(splitData);
                                if (friendList.status)
                                    params.friendfacebook = friendList.friend;
                                else
                                    params.friendfacebook = [];
                            }
                        }
                    }
                }
            }
            if (params.referencecode != undefined) {
                if (params.referencecode.trim() != "") {
                    var countRefer = await getReferCode(params);
                    if (countRefer.status) {
                        // If user is Star User
                        if (countRefer.referData.isuserstartype) {
                            params.referencecode = null;
                            params.referencestarcode = countRefer.referData.usercode;
                        } else {
                            params.referencecode = params.referencecode;
                            params.referencestarcode = countRefer.referData.referencestarcode;
                        }
                    } else {
                        params.referencecode = null;
                        params.referencestarcode = null;
                    }
                }
            }
            var insertUser = await new User(params);
            insertUser.save();
            return {
                status: true,
                msg: "Waiting for Verify User and create otp.",
                registerData: insertUser.issocial
            };
        } else {
            return {
                status: false,
                msg: "Waiting for Verify User and create otp."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// Get Social Register
async function getSocailRegister(params) {
    try {
        const { email, mobile } = params;
        var countuser = await User.countDocuments({ $or: [{ email: email }, { mobile: mobile }] });
        if (countuser == 0) {
            if (params.referencecode != undefined) {
                if (params.referencecode.trim() != "") {
                    var countRefer = await getReferCode(params);
                    if (countRefer.status) {
                        // If user is Star User
                        if (countRefer.referData.isuserstartype) {
                            params.referencecode = null;
                            params.referencestarcode = countRefer.referData.usercode;
                        } else {
                            params.referencecode = params.referencecode;
                            params.referencestarcode = countRefer.referData.referencestarcode;
                        }
                    } else {
                        params.referencecode = null;
                        params.referencestarcode = null;
                    }
                } else {
                    params.referencecode = null;
                }
            }
            params.online = false;
            params.devicetype = "WEB";
            var insertUser = await new User(params);
            var getInsertUser = await insertUser.save();
            if (getInsertUser != undefined) {
                params.otptype = true;
                var sendOneTimePassword = await sendOtp(params);
                if (sendOneTimePassword.status) {
                    return {
                        status: true,
                        code: 1,
                        msg: "Waiting for Verify User and create otp.",
                        issocial: insertUser.issocial
                    };
                } else {
                    return {
                        status: false,
                        code: 2,
                        msg: "Please Resend OTP.",
                        issocial: insertUser.issocial
                    };
                }
            } else {
                return {
                    status: false,
                    msg: "Error on register."
                };
            }
        } else {
            countuser = await User.findOne({ mobile: mobile });
            if (countuser != undefined) {
                if (countuser.isverify) {
                    return {
                        status: false,
                        code: 0,
                        msg: "Mobile number is register.Please login."
                    };
                } else {
                    return {
                        status: true,
                        code: 1,
                        msg: "Waiting for Verify User and create otp.",
                        issocial: countuser.issocial
                    };
                }
            } else {
                return {
                    status: false,
                    code: 0,
                    msg: "Something Wrong."
                };
            }
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


// Get Reference Code
async function getReferCode(params) {
    try {
        const { referencecode } = params;
        var getRefernce = await User.findOne({ usercode: referencecode }).select({ usercode: 1, referencestarcode: 1, _id: 0, isuserstartype: 1 });
        if (getRefernce != undefined) {
            return {
                status: true,
                referData: getRefernce
            };
        } else {
            return {
                status: false
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// OTP Send
async function sendOtp(params) {
    try {
        var insertOtp = await new Otp({
            otp: "1234",
            mobile: params.mobile,
            otptype: params.otptype
        });
        var getInsert = await insertOtp.save();
        if (getInsert != undefined) {
            return {
                status: true,
                msg: "Send otp successufully.",
                otptype: insertOtp.otptype
            };
        } else {
            return {
                status: false,
                msg: "Send otp error."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }

}

// Verify User
async function verifyOtp(params) {
    try {
        const { mobile, otp } = params;
        var findOtp = await Otp.findOne({ mobile: mobile }).populate({ path: 'user', select: 'mobile' }).lean();
        if (findOtp != null) {
            if (findOtp.otp == otp) {
                var finduser;
                if (findOtp.otptype) {
                    var findFreecoin = await Keyword.find({},{_id: 0, key: 1, value: 1});
                    
                    var computerCoin = 500;
                    finduser = await User.findOneAndUpdate({ mobile: mobile }, { $set: { isverify: true, "coin": parseInt(computerCoin), "totalcoin": parseInt(computerCoin) } }, {
                        "fields": {
                            mobile: 1,
                            username: 1, usercode: 1, referencecode: 1, referencestarcode: 1, email: 1,
                            profilepic: 1, name: 1, gender: 1, dateofbirth: 1, totalwin: 1, totalplay: 1, totalpoint: 1,
                            currentbalanceofpoints: 1, totalwinningpoints: 1, totaltournamentpoints: 1,
                            totalreferralpoints: 1, isuserstartype: 1
                        }, new: true
                    });
                    const accessToken = await signAccessToken(finduser.username)
                    const refreshToken = await signRefreshToken(finduser.username)
                    if (finduser.isuserstartype) {
                        return {
                            status: true,
                            code: 1,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            user: {
                                mobile: finduser.mobile,
                                username: finduser.username,
                                usercode: finduser.usercode,
                                referencecode: finduser.referencecode,
                                referencestarcode: finduser.referencestarcode,
                                email: finduser.email,
                                profilepic: finduser.profilepic,
                                name: finduser.name,
                                gender: finduser.gender,
                                dateofbirth: finduser.dateofbirth
                            },
                            pointdetail: {
                                totalwin: finduser.totalwin,
                                totalplay: finduser.totalplay,
                                totalpoint: finduser.totalpoint,
                                currentbalanceofpoints: finduser.currentbalanceofpoints,
                                totalwinningpoints: finduser.totalwinningpoints,
                                totaltournamentpoints: finduser.totaltournamentpoints,
                                totalreferralpoints: finduser.totalreferralpoints
                            },
                            coindetail: {
                                coin: 500
                            }
                        }
                    } else {
                        return {
                            status: true,
                            code: 1,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            user: {
                                mobile: finduser.mobile,
                                username: finduser.username,
                                usercode: finduser.usercode,
                                referencecode: finduser.referencecode,
                                referencestarcode: finduser.referencestarcode,
                                email: finduser.email,
                                profilepic: finduser.profilepic,
                                name: finduser.name,
                                gender: finduser.gender,
                                dateofbirth: finduser.dateofbirth
                            },
                            pointdetail: {
                                totalwin: finduser.totalwin,
                                totalplay: finduser.totalplay,
                                currentbalanceofpoints: finduser.currentbalanceofpoints,
                                totalwinningpoints: finduser.totalwinningpoints,
                                totalreferralpoints: finduser.totalreferralpoints
                            },
                            coindetail: {
                                coin: 500
                            }
                        }
                    }
                } else if (!findOtp.otptype) {
                    return {
                        status: true,
                        code: 0,
                        msg: "Please reset new password."
                    }
                }
            } else {
                return {
                    status: false,
                    msg: "Otp is wrong."
                };
            }
        } else {
            return {
                status: false,
                msg: "Please resend otp."
            };
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            msg: error
        };
    }
}

// Forget Password 
async function foregetPassword(params) {
    try {
        const { mobile } = params;
        params.otptype = false;
        var findUser = await User.findOneAndUpdate({ mobile: mobile }, { $set: { isverify: false } }, { "fields": { mobile: 1 } });
        if (findUser != undefined) {
            var sendOneTimePassword = await sendOtp(params);
            if (sendOneTimePassword.status) {
                /// Open Screen Verify User
                return {
                    status: true,
                    code: 1,
                    msg: "Please fill up otp and password." /// 
                };
            } else {
                return {
                    status: true,
                    code: 0,
                    msg: "Please Resend OTP."
                };
            }
        } else {
            return {
                status: false,
                msg: "Please enter register mobile number."
            };
        }

    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// Reset Password
async function resetPassword(params) {
    try {
        const { mobile, newpassword } = params;
        var findOtp = await Otp.findOne({ mobile: mobile }).populate({ path: 'user', select: 'mobile' }).lean();
        var encryptpass = await encryptPassword(params);
        if (encryptpass.status && findOtp != undefined) {
            var updatePassword = await User.findOneAndUpdate({ mobile: mobile }, { $set: { password: encryptpass.encryptPass, isverify: true } }, { "fields": { _id: 0, username: 1 } });
            if (updatePassword != undefined) {
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
            if (!encryptpass.status)
                return encryptpass;
            else {
                return {
                    status: false,
                    msg: "Please Resend OTP."
                };
            }
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { customCountUser, socialCountUser, saveUser, getCustomeRegister, getSocailRegister, verifyOtp, foregetPassword, sendOtp, resetPassword };