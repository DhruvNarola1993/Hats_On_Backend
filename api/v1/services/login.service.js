const User = require('../models/user.model');
const Level = require('../models/level.model');
const Otp = require("../models/otp.password.model");
const bcrypt = require("bcrypt");
const { multiplayerversionavailbilitystatusUser, multiplayeradsversionstatusUser } = require('./register.service');
const { listInit } = require('./../common/common.init.service');
const { checkSubscription, socialcheckSubscription } = require('./user.subcription.service');
const { sendSms } = require('../../../config/send.otp.config');
// const { listAllKeyword } = require('./keyword.service');

async function socialLoginUser(params) {
    try {
        const { userid, connectionid, online } = params;
        var findUser = await User.findOne({ userid: userid }).select({
            _id: 1, issocial: 1, mobile: 1, email: 1, username: 1,
            password: 1, profilepic: 1, name: 1, gender: 1, dateofbirth: 1,
            lastname: 1, isverify: 1, setting: 1, totalcoin: 1, isactive: 1,
            totalwin: 1, useratingid: 1, userlevelid: 1, coin: 1, online: 1,
            hatsonpoints: 1, currentbalanceofpoints: 1, usercode: 1, referencestarcode: 1,
            isavatar: 1
        });
        if (findUser != null) {
            if (findUser.isverify && findUser.isactive) {
                var listKey = await listInit();
                var userlevelno = -1;
                var userrateno = -1;
                if (findUser.useratingid != null && findUser.userlevelid != null) {
                    var findUserLevel = await Level.aggregate([
                        { "$match": { _id: findUser.userlevelid } },
                        {
                            "$lookup":
                            {
                                from: "ratings",
                                localField: "ratingid",
                                foreignField: "_id",
                                as: "rating"
                            }
                        },
                        {
                            "$project": {
                                "_id": 0,
                                "userlevelno": "$rating.rateno",
                                "userrateno": "$levelno",

                            }
                        }
                    ]);
                    if (findUserLevel.length > 0) {
                        userlevelno = findUserLevel[0].userlevelno[0];
                        userrateno = findUserLevel[0].userrateno;
                    }

                } else {
                    userlevelno = 0;
                    userrateno = 0;
                }
                if (findUser.online == false) {
                    var multiplayerversionavailbilitystatus = await multiplayerversionavailbilitystatusUser();
                    var multiplayeradsversionstatus = await multiplayeradsversionstatusUser();
                    var isSubcriberUser = await socialcheckSubscription(findUser);
                    await User.findOneAndUpdate({ userid: userid }, { $set: { connectionid: connectionid, online: true } }, {
                        "fields": {
                            _id: 1
                        }, new: true
                    });
                    return {
                        status: true,
                        loginData: {
                            setting: {
                                control: findUser.setting.control,
                                music: findUser.setting.music,
                                sound: findUser.setting.sound,
                                vibration: findUser.setting.vibration,
                                language: findUser.setting.language
                            },
                            isverify: findUser.isverify,
                            hcoin: findUser.coin, // Computer Coin
                            hpoint: findUser.hatsonpoints, // Ads Version Point
                            issocial: findUser.issocial,
                            mobile: findUser.mobile,
                            usercode: findUser.usercode,
                            username: findUser.username,
                            userlevelno: userlevelno,
                            userrateno: userrateno,
                            totalwin: findUser.totalwin,
                            currentbalanceofpoints: findUser.currentbalanceofpoints, // Point Version
                            password: findUser.password,
                            _id: findUser._id,
                            email: findUser.email,
                            profilepic: findUser.profilepic,
                            isavatar: findUser.isavatar,
                            name: findUser.name,
                            lastname: findUser.lastname,
                            gender: findUser.gender,
                            dateofbirth: findUser.dateofbirth,
                            referencestarcode: findUser.referencestarcode,
                            "MultiplayerVersionAvailabilityStatus": multiplayerversionavailbilitystatus,
                            "MultiplayerAdsVersionStatus": multiplayeradsversionstatus,
                            "isSubcriptionAvalibleStatus": isSubcriberUser.status
                        },
                        ...listKey
                    };
                } else {
                    return {
                        status: false,
                        code: 3,
                        msg: "This user is already using another device. \n Please sign out from the other device first."
                    };
                }

            } else if (findUser.isverify == false) {
                params.userid = findUser.userid;
                params.otptype = true;
                await User.deleteOne({ userid: userid });
                return {
                    status: false,
                    code: 2,
                    msg: "Mobile Not Registered. Please first Sign Up."
                };

            } else {
                return {
                    status: false,
                    code: 2,
                    msg: "Access Denied."
                };
            }
        } else {
            return {
                status: false,
                code: 2,
                msg: "Mobile number is not registered. Please sign up first."
            };
        }
    } catch (error) {
        return {
            status: false,
            code: 2,
            msg: error
        };
    }
}

async function customLoginUser(params) {
    try {
        const { mobile, password, connectionid, online } = params;
        var findUser = await User.findOne({ mobile: mobile }).select({
            _id: 1, issocial: 1, mobile: 1, email: 1, username: 1,
            password: 1, profilepic: 1,
            name: 1, gender: 1, dateofbirth: 1, lastname: 1, isverify: 1, setting: 1, totalcoin: 1, isactive: 1,
            totalwin: 1, useratingid: 1, userlevelid: 1, coin: 1, online: 1,
            hatsonpoints: 1, currentbalanceofpoints: 1, usercode: 1, referencestarcode: 1,
            isavatar: 1
        });
        if (findUser != null) {
            var validPassword = await checkUser(password, findUser.password);
            if (validPassword.status) {
                if (findUser.isverify && findUser.isactive) {
                    var listKey = await listInit();
                    var userlevelno = -1;
                    var userrateno = -1;
                    if (findUser.useratingid != null && findUser.userlevelid != null) {
                        var findUserLevel = await Level.aggregate([
                            { "$match": { _id: findUser.userlevelid } },
                            {
                                "$lookup":
                                {
                                    from: "ratings",
                                    localField: "ratingid",
                                    foreignField: "_id",
                                    as: "rating"
                                }
                            },
                            {
                                "$project": {
                                    "_id": 0,
                                    "userlevelno": "$rating.rateno",
                                    "userrateno": "$levelno",

                                }
                            }
                        ]);
                        if (findUserLevel.length > 0) {
                            userlevelno = findUserLevel[0].userlevelno[0];
                            userrateno = findUserLevel[0].userrateno;
                        }
                    } else {
                        userlevelno = 0;
                        userrateno = 0;
                    }
                    if (findUser.online == false) {
                        var multiplayerversionavailbilitystatus = await multiplayerversionavailbilitystatusUser();
                        var multiplayeradsversionstatus = await multiplayeradsversionstatusUser();
                        var isSubcriberUser = await checkSubscription(findUser);
                        await User.findOneAndUpdate({ mobile: mobile }, { $set: { connectionid: connectionid, online: true } }, {
                            "fields": {
                                _id: 1
                            }, new: true
                        });

                        return {
                            status: true,
                            loginData: {
                                setting: {
                                    control: findUser.setting.control,
                                    music: findUser.setting.music,
                                    sound: findUser.setting.sound,
                                    vibration: findUser.setting.vibration,
                                    language: findUser.setting.language
                                },
                                isverify: findUser.isverify,
                                hcoin: findUser.coin, // Computer Coin
                                hpoint: findUser.hatsonpoints, // Ads Version Point
                                currentbalanceofpoints: findUser.currentbalanceofpoints, // Point Version
                                issocial: findUser.issocial,
                                mobile: findUser.mobile,
                                usercode: findUser.usercode,
                                username: findUser.username,
                                totalwin: findUser.totalwin,
                                userlevelno: userlevelno,
                                userrateno: userrateno,
                                password: findUser.password,
                                _id: findUser._id,
                                email: findUser.email,
                                profilepic: findUser.profilepic,
                                isavatar: findUser.isavatar,
                                name: findUser.name,
                                lastname: findUser.lastname,
                                gender: findUser.gender,
                                dateofbirth: findUser.dateofbirth,
                                referencestarcode: findUser.referencestarcode,
                                "MultiplayerVersionAvailabilityStatus": multiplayerversionavailbilitystatus,
                                "MultiplayerAdsVersionStatus": multiplayeradsversionstatus,
                                "isSubcriptionAvalibleStatus": isSubcriberUser.status
                            },
                            ...listKey
                        };
                    } else {
                        return {
                            status: false,
                            code: 3,
                            msg: "This user is already using another device. \n Please sign out from the other device first."
                        };
                    }

                } else if (findUser.isverify == false) {
                    params.otptype = true;
                    await User.deleteOne({ mobile: mobile });  // by abhineet -- 25/11/2021 
                    // var sendOTP = await sendOtp(params);
                    // if (sendOTP.status) {
                    //     return {
                    //         status: false,
                    //         code: 0,
                    //         msg: "Your mobile number is not verified, Please verify first."
                    //     };
                    // } else {
                    //     return {
                    //         status: false,
                    //         code: 2,
                    //         msg: "OTP Error."
                    //     };
                    // }
                    return {
                        status: false,
                        code: 2,
                        msg: "Mobile Not Registered. Please first Sign Up."
                    };
                } else {
                    return {
                        status: false,
                        code: 2,
                        msg: "Access Denied." // Access Deneid
                    };
                }
            } else {
                return {
                    status: false,
                    code: 1,
                    msg: "Password confirmation does not match."
                };
            }
        } else {
            return {
                status: false,
                code: 2,
                msg: "Mobile number is not registered. Please sign up first."
            };
        }
    } catch (error) {
        return {
            status: false,
            code: 2,
            msg: error
        };
    }
}

async function checkUser(password, dbpassword) {
    try {
        const match = await bcrypt.compare(password, dbpassword);
        if (match) {
            return {
                status: true
            };
        } else {
            return {
                status: false,
                msg: "Invalid Password. \n Please Try Again."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

async function logoutService(params) {
    try {
        const { username } = params;
        await User.findOneAndUpdate({ username: username }, { $set: { online: false, connectionid: "" } }, { "fields": { _id: 1 } });
        return true;
    } catch (error) {
        return {
            status: true
        };
    }
}



async function updatepasswordUser(params) {
    try {
        const { mobile, password, otp } = params;
        var findOtp = await Otp.findOne({ mobile: mobile }).populate('user', 'mobile').lean();
        if (findOtp != undefined) {
            if(findOtp.otp == otp) {
                const bcryptSalt = await bcrypt.genSalt(10);
                const bcryptHash = await bcrypt.hash(password, bcryptSalt);
                var userUpdatePassword = await User
                    .findOneAndUpdate({ mobile: mobile }, { $set: { password: bcryptHash } }, { new: true, "fields": { _id: 0 } });
                if (userUpdatePassword != undefined) {
                    return {
                        status: true,
                        msg: "Password successfully changed."
                    };
                } else {
                    return {
                        status: false,
                        msg: "Please Try Again. Password cound not be reset."
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
            msg: error
        };
    }
}


async function sendOtpForUpdate(params) {
    try {
        const { mobile } = params;
        var sendOTPViaSMS = await sendSms(params);
        if (sendOTPViaSMS.status) {
            var insertOtp = await new Otp({
                otp: sendOTPViaSMS.otpNo,
                mobile: mobile,
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

module.exports = { socialLoginUser, customLoginUser, logoutService, updatepasswordUser, sendOtpForUpdate };