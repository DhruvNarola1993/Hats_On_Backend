const Otp = require('../models/otp.model');
const User = require('../models/user.model');
const MultiplayerVersionAvailabilityStatus = require("../models/multiplayer.version.availability.status.model");
const MultiplayerAdsVersionStatus = require("../models/multiplayer.ads.version.status.model");
var moment = require("moment");
const bcrypt = require("bcrypt");
const { listInit } = require('./../common/common.init.service');
const { sendSms } = require("./../../../config/send.otp.config");
// const { listAllKeyword } = require('./keyword.service');

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
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

async function socialCountUser(params) {
    try {
        const { mobile, email, logintype, userid } = params;

        if (logintype != "FACEBOOK") {
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
        } else {
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
                    msg: "Mobile number already registered. Please sign in."
                };
            }
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

async function getReferCode(params) {
    try {
        const { referencecode } = params;
        var getRefernce = await User.findOneAndUpdate({ usercode: referencecode },
            {
                "$inc": { totalcoin: parseInt(100), coin: parseInt(100) }
            },
            {
                "fields": { usercode: 1, referencestarcode: 1, _id: 0, isuserstartype: 1 },
                "new": true
            }
        );
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
            msg: "Something went wrong. Please restart the App and try again."
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
                msg: "Waiting for OTP verification.",
                registerData: insertUser.issocial
            };
        } else {
            return {
                status: false,
                msg: "Something went wrong. Please restart the App and try again."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}


// User Get FreindList
async function getFriends(params) {
    try {
        var getFriend = await User.find({ username: { $in: params } }, { username: 1 });
        if (getFriend != undefined) {
            //console.log(getFriend);
            if (getFriend.length > 0) {
                return {
                    status: true,
                    friend: getFriend
                };
            } else {
                return {
                    status: false
                };
            }
        } else {
            return {
                status: true,
                code: 0
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

async function sendOtp(params) {
    try {
        const { mobile, otptype } = params;
        var sendOTPViaSMS = await sendSms(params);
        if (sendOTPViaSMS.status) {
            var insertOtp = await new Otp({
                otp: sendOTPViaSMS.otpNo,
                mobile: mobile,
                otptype: otptype,
                createdate: new Date()
            });
            insertOtp = await insertOtp.save();
            if (insertOtp != undefined) {
                return {
                    status: true,
                    msg: "OTP sent successfully.",
                    otptype: insertOtp.otptype
                };
            } else {
                return {
                    status: false,
                    msg: "OTP sent unsuccessfully."
                };
            }

        } else {
            return {
                status: false,
                msg: "OTP sent unsuccessfully."
            };
        }
    } catch (error) {
        //console.log(error)
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

async function verifyOtp(params) {
    try {
        const { mobile, otp } = params;
        var findOtp = await Otp.findOne({ mobile: mobile }).populate({ path: 'user', select: 'mobile' }).lean();
        if (findOtp != null) {
            if (findOtp.otp == otp) {
                if (findOtp.otptype) {
                    var listKey = await listInit();
                    var multiplayerversionavailbilitystatus = await multiplayerversionavailbilitystatusUser();
                    var multiplayeradsversionstatus = await multiplayeradsversionstatusUser();
                    var computerCoin = listKey.listKeyword.FreeVersionRegisterCoin == undefined || "" || null ? 500 : listKey.listKeyword.FreeVersionRegisterCoin;
                    var userUpdate = await User.findOneAndUpdate({ mobile: mobile }, { $set: { isverify: true, "coin": parseInt(computerCoin), online: true } }, {
                        "fields": {
                            _id: 1, issocial: 1, mobile: 1, email: 1, username: 1, referencecode: 1, password: 1, profilepic: 1,
                            name: 1, gender: 1, dateofbirth: 1, lastname: 1, isverify: 1, setting: 1, totalcoin: 1, coin: 1,
                            totalwin: 1, hatsonpoints: 1, currentbalanceofpoints: 1, usercode: 1, referencestarcode: 1
                        }, new: true
                    });
                    return {
                        status: true,
                        code: 1,
                        verifyUser: {
                            setting: {
                                control: userUpdate.setting.control,
                                music: userUpdate.setting.music,
                                sound: userUpdate.setting.sound,
                                vibration: userUpdate.setting.vibration,
                                language: userUpdate.setting.language
                            },
                            isverify: userUpdate.isverify,
                            hcoin: userUpdate.coin, // computer coin
                            hpoint: userUpdate.hatsonpoints, // Ads Version Point
                            currentbalanceofpoints: userUpdate.currentbalanceofpoints, // Point Version
                            issocial: userUpdate.issocial,
                            mobile: userUpdate.mobile,
                            usercode: userUpdate.usercode,
                            username: userUpdate.username,
                            userlevelno: 0,
                            userrateno: 0,
                            totalwin: userUpdate.totalwin,
                            password: userUpdate.password,
                            _id: userUpdate._id,
                            email: userUpdate.email,
                            profilepic: userUpdate.profilepic,
                            name: userUpdate.name,
                            lastname: userUpdate.lastname,
                            gender: userUpdate.gender,
                            dateofbirth: userUpdate.dateofbirth,
                            referencestarcode: userUpdate.referencestarcode,
                            "MultiplayerVersionAvailabilityStatus": multiplayerversionavailbilitystatus,
                            "MultiplayerAdsVersionStatus": multiplayeradsversionstatus,
                            "isSubcriptionAvalibleStatus": false
                        },
                        ...listKey
                    };
                } else if (!findOtp.otptype) {
                    var userOneUpdate = await User.findOneAndUpdate({ mobile: mobile }, { $set: { isverify: true } }, {
                        "fields": {
                            _id: 1, totalwin: 1
                        }, new: true
                    });
                    return {
                        status: true,
                        code: 0,
                        otptype: findOtp.otptype
                    };
                }
            } else {
                return {
                    status: false,
                    msg: "Incorrect OTP. Please try again."
                };
            }
        } else {
            return {
                status: false,
                msg: "OTP has expired. Please tap on Resend OTP to get a new OTP."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

async function mobileCountUser(params) {
    try {
        const { mobile } = params;
        var countUser = await User.countDocuments({ mobile: mobile });
        if (countUser == 1) {
            return {
                status: true
            };
        } else {
            return {
                status: false,
                msg: "Mobile Not Registered. Please first Sign Up."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

async function resetpasswordUser(params) {
    try {
        const { mobile, password } = params;
        var findOtp = await Otp.findOne({ mobile: mobile }).populate('user', 'mobile').lean();
        if (findOtp != null) {
            const bcryptSalt = await bcrypt.genSalt(10);
            const bcryptHash = await bcrypt.hash(password, bcryptSalt);
            var userUpdatePassword = await User
                .findOneAndUpdate({ mobile: mobile }, { $set: { password: bcryptHash } }, { new: true, "fields": { _id: 0 } });
            if (userUpdatePassword != null) {
                return {
                    status: true,
                    msg: "Password successfully changed."
                };
            } else {
                return {
                    status: false,
                    msg: "Password could not be reset."
                };
            }
        } else {
            return {
                status: false,
                msg: "OTP has expired. Please tap on Resend OTP to get a new OTP."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Multiplayer Version Availability Status
async function multiplayerversionavailbilitystatusUser() {
    try {
        var multiplayerVersionAvailabilityStatus = await MultiplayerVersionAvailabilityStatus.find({}).select({
            "name": 1,
            "startdate": 1,
            "enddate": 1
        });
        var date = moment(new Date());
        var MultiplayerPlayOnline = false;
        var PlayWithFriends = false;
        var Tournaments = false;
        var ReferralPoints = false;
        if (multiplayerVersionAvailabilityStatus.length > 0) {
            for (let index = 0; index < multiplayerVersionAvailabilityStatus.length; index++) {
                const name = multiplayerVersionAvailabilityStatus[index].name;
                const startDate = multiplayerVersionAvailabilityStatus[index].startdate;
                const endDate = multiplayerVersionAvailabilityStatus[index].enddate;
                var startdate = moment(startDate).startOf('day');
                var enddate = moment(endDate).endOf('day');
                var differenceStartdate = moment(date).diff(startdate, 'days');
                var differenceEnddate = moment(date).diff(enddate, 'days');
                if (name == "MultiplayerPlayOnline") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        MultiplayerPlayOnline = true;
                    }
                } else if (name == "PlayWithFriends") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        PlayWithFriends = true;
                    }
                } else if (name == "Tournaments") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        Tournaments = true;
                    }
                } else if (name == "ReferralPoints") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        ReferralPoints = true;
                    }
                }
            }
        }
        return {
            "MultiplayerPlayOnline": MultiplayerPlayOnline,
            "PlayWithFriends": PlayWithFriends,
            "Tournaments": Tournaments,
            "ReferralPoints": ReferralPoints
        };
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}


// Multiplayer Version Availability Status
async function multiplayeradsversionstatusUser() {
    try {
        var multiplayerAdsVersionStatus = await MultiplayerAdsVersionStatus.find({}).select({
            "name": 1,
            "startdate": 1,
            "enddate": 1
        });
        var date = moment(new Date());
        var MultiplayerPlayOnline = false;
        var PlayWithFriends = false;
        var Tournaments = false;
        var ReferralPoints = false;
        if (multiplayerAdsVersionStatus.length > 0) {
            for (let index = 0; index < multiplayerAdsVersionStatus.length; index++) {
                const name = multiplayerAdsVersionStatus[index].name;
                const startDate = multiplayerAdsVersionStatus[index].startdate;
                const endDate = multiplayerAdsVersionStatus[index].enddate;
                var startdate = moment(startDate).startOf('day');
                var enddate = moment(endDate).endOf('day');
                var differenceStartdate = moment(date).diff(startdate, 'days');
                var differenceEnddate = moment(date).diff(enddate, 'days');
                if (name == "MultiplayerPlayOnline") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        MultiplayerPlayOnline = true;
                    }
                } else if (name == "PlayWithFriends") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        PlayWithFriends = true;
                    }
                } else if (name == "Tournaments") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        Tournaments = true;
                    }
                } else if (name == "ReferralPoints") {
                    if (differenceStartdate >= 0 && differenceEnddate <= 0) {
                        ReferralPoints = true;
                    }
                }
            }
        }
        return {
            "MultiplayerPlayOnline": MultiplayerPlayOnline,
            "PlayWithFriends": PlayWithFriends,
            "Tournaments": Tournaments,
            "ReferralPoints": ReferralPoints
        };
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}


module.exports = {
    customCountUser, socialCountUser, getReferCode,
    saveUser, sendOtp, verifyOtp,
    mobileCountUser, resetpasswordUser,
    multiplayerversionavailbilitystatusUser,
    multiplayeradsversionstatusUser
};