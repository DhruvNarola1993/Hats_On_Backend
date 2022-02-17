var User = require('./../../../api/v1/models/user.model'); // This is application User
const bcrypt = require("bcrypt");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('./../middleware/auth.middleware');
const client = require('./../../../connection/redisconnection');

// Login
async function getCustomeLogin(params) {
    try {
        const { mobile, password } = params;
        var finduser = await User.findOne({ mobile: mobile }).select({
            mobile: 1,
            password: 1,
            username: 1,
            usercode: 1,
            referencecode: 1,
            referencestarcode: 1,
            email: 1,
            profilepic: 1,
            name: 1,
            gender: 1,
            dateofbirth: 1,
            totalwin: 1,
            totalplay: 1,
            totalpoint: 1,
            currentbalanceofpoints: 1,
            totalwinningpoints: 1,
            totaltournamentpoints: 1,
            totalreferralpoints: 1,
            isuserstartype: 1,
            isactive: 1,
            isverify: 1
        });
        if (finduser != undefined) {
            var isMatch = await checkUser(password, finduser.password);
            if (isMatch.status) {
                if (finduser.isactive) {
                    if (finduser.isverify) {
                        const accessToken = await signAccessToken(finduser.username)
                        const refreshToken = await signRefreshToken(finduser.username)
                        if (finduser.isuserstartype) {
                            return {
                                status: true,
                                code: 0,
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
                                    dateofbirth: finduser.dateofbirth,
                                    isuserstartype: finduser.isuserstartype
                                },
                                pointdetail: {
                                    totalwin: finduser.totalwin,
                                    totalplay: finduser.totalplay,
                                    totalpoint: finduser.totalpoint,
                                    currentbalanceofpoints: finduser.currentbalanceofpoints,
                                    totalwinningpoints: finduser.totalwinningpoints,
                                    totaltournamentpoints: finduser.totaltournamentpoints,
                                    totalreferralpoints: finduser.totalreferralpoints
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
                                    dateofbirth: finduser.dateofbirth,
                                    isuserstartype: finduser.isuserstartype
                                },
                                pointdetail: {
                                    totalwin: finduser.totalwin,
                                    totalplay: finduser.totalplay,
                                    currentbalanceofpoints: finduser.currentbalanceofpoints,
                                    totalwinningpoints: finduser.totalwinningpoints,
                                    totalreferralpoints: finduser.totalreferralpoints
                                }
                            }
                        }
                    } else {
                        // return {
                        //     status: false,
                        //     code: 0,
                        //     msg: "User is not verfiy."
                        // };
                        await User.deleteMany({ mobile: mobile });
                        return {
                            status: false,
                            code: 3,
                            msg: "User is not register."
                        };
                    }

                } else {
                    return {
                        status: false,
                        code: 2,
                        msg: "User is not active."
                    };
                }
            } else {
                return isMatch;
            }
        } else {
            return {
                status: false,
                code: 3,
                msg: "Mobile number and password does not match."
            };
        }
    } catch (error) {
        return {
            status: false,
            code: 4,
            msg: "Catch Error."
        };
    }
}

// Check Password Encrypted
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
                code: 5,
                msg: "Password is incorrect."
            };
        }
    } catch (error) {
        return {
            status: false,
            code: 4,
            msg: "Catch Error."
        };
    }
}

// Get Socail Login
async function getSocailLogin(params) {
    try {
        const { userid } = params;
        var finduser = await User.findOne({ userid: userid }).select({
            username: 1,
            mobile: 1,
            usercode: 1,
            referencecode: 1,
            referencestarcode: 1,
            email: 1,
            profilepic: 1,
            name: 1,
            gender: 1,
            dateofbirth: 1,
            totalwin: 1,
            totalplay: 1,
            totalpoint: 1,
            currentbalanceofpoints: 1,
            totalwinningpoints: 1,
            totaltournamentpoints: 1,
            totalreferralpoints: 1,
            isuserstartype: 1,
            isactive: 1,
            isverify: 1
        });
        if (finduser != undefined) {
            if (finduser.isactive) {
                if (finduser.isverify) {
                    const accessToken = await signAccessToken(finduser.username);
                    const refreshToken = await signRefreshToken(finduser.username);
                    if (finduser.isuserstartype) {
                        return {
                            status: true,
                            code: 0,
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
                                dateofbirth: finduser.dateofbirth,
                                isuserstartype: finduser.isuserstartype
                            },
                            pointdetail: {
                                totalwin: finduser.totalwin,
                                totalplay: finduser.totalplay,
                                totalpoint: finduser.totalpoint,
                                currentbalanceofpoints: finduser.currentbalanceofpoints,
                                totalwinningpoints: finduser.totalwinningpoints,
                                totaltournamentpoints: finduser.totaltournamentpoints,
                                totalreferralpoints: finduser.totalreferralpoints
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
                                dateofbirth: finduser.dateofbirth,
                                isuserstartype: finduser.isuserstartype
                            },
                            pointdetail: {
                                totalwin: finduser.totalwin,
                                totalplay: finduser.totalplay,
                                currentbalanceofpoints: finduser.currentbalanceofpoints,
                                totalwinningpoints: finduser.totalwinningpoints,
                                totalreferralpoints: finduser.totalreferralpoints
                            }
                        }
                    }
                } else {
                    // return {
                    //     status: false,
                    //     code: 0,
                    //     msg: "User is not verfiy."
                    // };
                    await User.deleteMany({ email: email });
                    return {
                        status: false,
                        code: 3,
                        msg: "User is not register."
                    };
                }

            } else {
                return {
                    status: false,
                    code: 2,
                    msg: "User is not active."
                };
            }

        } else {
            return {
                status: false,
                code: 3,
                msg: "User is not register."
            };
        }
    } catch (error) {
        console.log(error)
        if (error != undefined) {
            return {
                status: false,
                code: 3,
                msg: "Please login again.Expiry Token."
            };
        } else {
            
            return {
                status: false,
                code: 4,
                msg: "Please first register user then Login."
            };
        }
    }
}

// Get Refresh Token
async function getReferenceToken(params) {
    try {
        const { refreshToken } = params;
        const username = await verifyRefreshToken(refreshToken);
        const accessToken = await signAccessToken(username);
        const refToken = await signRefreshToken(username);
        var finduser = await User.findOne({ username: username }).select({
            username: 1,
            mobile: 1,
            usercode: 1,
            referencecode: 1,
            referencestarcode: 1,
            email: 1,
            profilepic: 1,
            name: 1,
            gender: 1,
            dateofbirth: 1,
            totalwin: 1,
            totalplay: 1,
            totalpoint: 1,
            currentbalanceofpoints: 1,
            totalwinningpoints: 1,
            totaltournamentpoints: 1,
            totalreferralpoints: 1,
            isuserstartype: 1,
            isactive: 1,
            isverify: 1
        });
        if (finduser != undefined) {
            if (finduser.isactive) {
                if (finduser.isverify) {
                    if (finduser.isuserstartype) {
                        return {
                            status: true,
                            code: 0,
                            accessToken: accessToken,
                            refreshToken: refToken,
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
                            }
                        }
                    } else {
                        return {
                            status: true,
                            code: 1,
                            accessToken: accessToken,
                            refreshToken: refToken,
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
                            }
                        }
                    }
                } else {
                    return {
                        status: false,
                        code: 0,
                        msg: "User is not verfiy."
                    };
                }

            } else {
                return {
                    status: false,
                    code: 2,
                    msg: "User is not active."
                };
            }

        } else {
            return {
                status: false,
                code: 3,
                msg: "Please login again.Invalid Token."
            };
        }
    } catch (error) {
        console.log(error)
        if (error != undefined) {
            return {
                status: false,
                code: 3,
                msg: "Please login again.Expiry Token."
            };
        } else {
            
            return {
                status: false,
                code: 4,
                msg: "Please first register user then Login."
            };
        }

    }
}

// Token Delete
async function logoutUser(params) {
    try {
        const { refreshToken } = params;
        const username = await verifyRefreshToken(refreshToken);
        await client.del(username);
        return {
            status: true,
            msg: "Log out user."
        };
    } catch (error) {
        return {
            status: true,
            msg: "Log out user."
        };
    }
}

module.exports = { getCustomeLogin, getSocailLogin, getReferenceToken, logoutUser, checkUser };