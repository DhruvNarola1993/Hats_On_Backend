var moment = require("moment");
var momentTimezone = require('moment-timezone');
var momentDurationFormatSetup = require("moment-duration-format");
var {
    merge: lodashMerge,
    keyBy: lodashkeyBy,
    assignIn: lodashassignIn,
    values: lodashvalues,
    map: lodashmap,
    chain: lodashchain,
    filter: lodashfilter,
    includes: lodashincludes,
} = require("lodash");
var Tournament = require("../models/tournament.model");
var User = require("../models/user.model");
var TournamentUser = require("../models/tournamentuser.model");

var mongoose = require("mongoose");

async function listAllTournament(params) {
    try {
        // Moment JS add on end-of registerdata flag and register closed
        const { type, username } = params;
        var listTournament = await Tournament.find({ type: type, isdisplay: true }, {
            name: 1,
            type: 1,
            status: 1,
            winner: 1,
            winnerpoint: 1,
            maxplayers: 1,
            registertotaluser: 1,
            registerstatus: 1,
            registeropendatetime: 1,
            registerclosedatetime: 1,
            registerpointsperuser: 1,
            numberofround: 1,
            startdatetime: 1,
            rounds: 1,
            speedytournamentearlypointsregister: 1,
            starcode: 1,
            _id: 1,
        }).lean();
        var registerUser = await TournamentUser.find({ username: username, type: type, isdelete: false }, {
            username: 1,
            tournamentid: 1,
            fullyconfirmedtournamentuser: 1,
            fullregistrationdate: 1,
            earlyconfirmedspeedytournamentuser: 1,
            earlyregistrationdate: 1,
            _id: 0,
        }).lean();
        if (listTournament.length >= 0) {
            var getListTournament = lodashmap(listTournament, (v) =>
                lodashassignIn({}, v, { isregister: false })
            );
            var finalData;
            if (registerUser != null) {
                if (registerUser.length > 0) {
                    var getRegisterTournament = lodashmap(registerUser, (v) =>
                        lodashassignIn({}, v, { isregister: true })
                    );
                    var mergeAll = lodashMerge(
                        lodashkeyBy(getListTournament, "_id"),
                        lodashkeyBy(getRegisterTournament, "tournamentid")
                    );
                    finalData = lodashvalues(mergeAll);
                } else {
                    finalData = getListTournament;
                }
            } else {
                finalData = getListTournament;
            }

            var occurrenceDay = function (occurrence) {
                // return moment(occurrence.registeropendatetime).startOf("day").format();
                // var updateDate = momentTimezone.utc(occurrence.registeropendatetime).tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
                // //console.log(occurrence.registeropendatetime, "           " , moment(updateDate).startOf("day").format())
                if (occurrence.rounds != undefined)
                    return moment(occurrence.rounds[0].roundentrystartdatetime).startOf("day").format();
            };
            var groupToDay = function (group, day) {
                return {
                    day: day,
                    listoftournament: group,
                };
            };

            result = lodashchain(finalData)
                .groupBy(occurrenceDay)
                .map(groupToDay)
                .sortBy("day")
                .value();

            if (result.length > 0) {
                for (let index = 0; index < result.length; index++) {
                    // Old Date -- W
                    // const element = result[index].day;
                    const element = momentTimezone.utc(result[index].day).tz("Asia/Kolkata").format('DD-MMM-YYYY');
                    // if(element != undefined || element != 'undefined') {
                        if (element != "Invalid date") {
                            //console.log(element);
                            result[index].day = element;
                            const e = result[index].listoftournament;
                            for (let i = 0; i < e.length; i++) {
                                const registerstardate = momentTimezone.utc(e[i].registeropendatetime).tz("Asia/Kolkata").format('DD-MMM-YYYY hh:mm A');
                                const registerclosedate = momentTimezone.utc(e[i].registerclosedatetime).tz("Asia/Kolkata").format('DD-MMM-YYYY hh:mm A');
                                result[index].listoftournament[i].registeropendatetime = registerstardate;
                                result[index].listoftournament[i].registerclosedatetime = registerclosedate;
                                //console.log(JSON.stringify(e[i]));
                            }
                            //console.log("**************************************");
                        }
                    // }
                }
            }


            return {
                status: true,
                listdatewiseTournament: result,
            };
        } else {
            return {
                status: false,
                msg: "Stay tuned for upcoming tournaments.",
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

/// Tournament Register by User
async function registerTournament(params) {
    try {
        const {
            tournamentid,
            username,
            tournamenttype,
            AdsVersionMultiplayerPlayOnline,
        } = params;
        var getUserTournamet = await TournamentUser.countDocuments({
            $and: [{ username: username, tournamentid: tournamentid }],
        });
        // get - registeropendatetime, registerclosedatetime, type, status, maxplayers,
        // update - registertotaluser,
        var getTournament = await Tournament.findById(tournamentid).select({
            registeropendatetime: 1,
            registerclosedatetime: 1,
            type: 1,
            status: 1,
            registerstatus: 1,
            winner: 1,
            maxplayers: 1,
            registertotaluser: 1,
            registertotaluser: 1,
            registerpointsperuser: 1,
            speedytournamentearlypointsregister: 1,
            starcode: 1,
        });
        var isWinnerUser = false;
        var isStarCodeUser = true; /// Reference Star Code and Tournament Star Code -- Same Code Check for Speedy and Star
        // update - hatsonpoints or currentbalanceofpoints
        // get - subscriptionlastdate
        var getUser = await User.findOne({ username: username }).select({
            hatsonpoints: 1,
            currentbalanceofpoints: 1,
            referencestarcode: 1,
        });
        if (getUserTournamet == 0) {
            var getUserCoin = 0;
            if (AdsVersionMultiplayerPlayOnline == true) {
                getUserCoin = getUser.hatsonpoints;
            } else {
                getUserCoin = getUser.currentbalanceofpoints;
            }
            //console.log(getUserCoin);

            /// Sequence Check Register Time,
            /// Register Status, Tournament Status
            /// Register Total User less than
            /// Register Amount Avalible
            /// Reference Star Code -- Same Code Check for Speedy and Star
            /// Super Tournament Win User List
            if (
                tournamenttype.toUpperCase() === "SPEEDY" ||
                tournamenttype.toUpperCase() === "STAR"
            ) {
                if (getTournament.starcode != getUser.referencestarcode) {
                    isStarCodeUser = false;
                }
            }
            if (tournamenttype.toUpperCase() !== "SPEEDY") {
                params.fullyconfirmedtournamentuser = true;
            } else {
                params.fullyconfirmedtournamentuser = false;
            }
            var openadmission = moment(getTournament.registeropendatetime);
            var closeadmission = moment(getTournament.registerclosedatetime);
            var currentdate = moment(new Date());
            var differentOpen = currentdate.diff(openadmission, "seconds"); // Enter Time
            var differentClosed = closeadmission.diff(currentdate, "seconds"); // Wait Time
            if (isStarCodeUser) {
                if (differentOpen > 0 && differentClosed > 0) {
                    if (
                        getTournament.registerstatus == "OPEN" &&
                        getTournament.status == "ACTIVE"
                    ) {
                        if (getTournament.maxplayers > getTournament.registertotaluser) {
                            var currentRegisterCoin = 0;
                            if (tournamenttype.toUpperCase() !== "SPEEDY") {
                                currentRegisterCoin = getTournament.registerpointsperuser;
                            } else {
                                currentRegisterCoin =
                                    getTournament.speedytournamentearlypointsregister;
                            }
                            if (
                                getUserCoin >= getUserCoin - currentRegisterCoin &&
                                getUserCoin - currentRegisterCoin >= 0
                            ) {
                                if (tournamenttype.toUpperCase() === "SUPER") {
                                    var winnerUsers = await Tournament.find({ winner: { $exists: true }, isactive: true }, { winner: 1, _id: 0 });
                                    var mapData = lodashmap(winnerUsers, "winner");
                                    isWinnerUser = lodashincludes(mapData, username);
                                }
                                if (
                                    tournamenttype.toUpperCase() !== "SUPER" ||
                                    (tournamenttype.toUpperCase() === "SUPER" && isWinnerUser)
                                ) {
                                    var updateRegistertotaluser = await Tournament.findByIdAndUpdate(
                                        tournamentid, { $inc: { registertotaluser: parseInt(1) } }, { fields: { _id: 0, registertotaluser: 1 }, new: true }
                                    );
                                    if (AdsVersionMultiplayerPlayOnline == true) {
                                        await User.findOneAndUpdate({ username: username }, {
                                            $inc: {
                                                hatsonpoints: -currentRegisterCoin,
                                                hatsonpointsplaygame: 1,
                                            },
                                        }, { fields: { _id: 1 }, new: true });
                                    } else {
                                        await User.findOneAndUpdate({ username: username }, {
                                            $inc: {
                                                currentbalanceofpoints: -currentRegisterCoin,
                                                totalplay: 1,
                                            },
                                        }, { fields: { _id: 1 }, new: true });
                                    }
                                    var registerTournamentByUser = await new TournamentUser({
                                        username: username,
                                        tournamentid: tournamentid,
                                        fullyconfirmedtournamentuser: params.fullyconfirmedtournamentuser,
                                        type: tournamenttype.toUpperCase(),
                                        adsversionmultiplayerplayonline: AdsVersionMultiplayerPlayOnline,

                                    });
                                    var saveRegisterTournamentByUser =
                                        await registerTournamentByUser.save();
                                    if (saveRegisterTournamentByUser != undefined) {
                                        return {
                                            status: true,
                                            msg: "Registration Successfull! Good Luck!",
                                            registerUserForTournament: saveRegisterTournamentByUser,
                                            updateRegisterTotalUser: updateRegistertotaluser.registertotaluser
                                        };
                                    } else {
                                        return {
                                            status: false,
                                            msg: "System error occurred. Please restart the app and try again.",
                                        };
                                    }
                                } else {
                                    return {
                                        status: false,
                                        msg: "You are not eligible to register for this Super tournament.",
                                    };
                                }
                            } else {
                                return {
                                    status: false,
                                    msg: `You have points ${getUserCoin}.You need points ${getTournament.registerpointsperuser} to register for this tournament. Please go to Add Points.`,
                                };
                            }
                        } else {
                            return {
                                status: false,
                                msg: `Tournament register max player.Please join other tournaments.`,
                            };
                        }
                    } else {
                        return {
                            status: false,
                            msg: `Tournament Registration Closed. Please join other tournaments.`,
                        };
                    }
                } else if (differentOpen <= 0) {
                    /// TODO : update X - X 10 Jan-2022 07:30AM
                    /// Update by Abhinet
                    return {
                        status: false,
                        msg: `Tournament registration not yet open.`,  /// Tournament register open after ${openadmission - X}.
                    };
                } else {
                    return {
                        status: false,
                        msg: `Please join other tournaments.`,
                    };
                }
            } else {
                /// TODO : update XYZ
                return {
                    status: false,
                    msg: "You are linked with Star XYZ.You can register only for tournaments under your star.Please go to your Star screen to register for the tournaments. ",
                };
            }
        } else {
            return {
                status: false,
                msg: "You are already registered for this tournament.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

/// Tournament Round by User
async function roundTournament(params) {
    try {
        const { tournamentid, username, AdsVersionMultiplayerPlayOnline } = params;
        // count -- User Register
        var getUserTournamet = await TournamentUser.countDocuments({
            $and: [{ username: username, tournamentid: tournamentid }],
        });
        // get - registeropendatetime, registerclosedatetime, type, status, maxplayers,
        var getTournament = await Tournament.findById(tournamentid).select({
            type: 1,
            rounds: 1,
        });
        if (getUserTournamet == 1) {
            var getRounds = getTournament.rounds;
            var totalrounds = getRounds.length;
            var arrayOfrounds = [];
            var arrayOfUserRounds = [];
            if (getRounds.length > 0) {
                var getUserRounds = await TournamentUser.findOne({ $and: [{ username: username, tournamentid: tournamentid }] }, {
                    isusereligible: 1,
                    diduserplaygame: 1,
                    diduserwin: 1,
                    previousround: 1,
                    nextround: 1,
                    _id: 0,
                }).lean();
                var previousround = getUserRounds.previousround;
                var isusereligible = getUserRounds.isusereligible;
                var diduserplaygame = getUserRounds.diduserplaygame;
                var diduserwin = getUserRounds.diduserwin;
                var pendingRound = -1;
                var completeRound = -1;
                var roundnumber = 0;

                if (previousround == 0) {
                    pendingRound = totalrounds;
                    completeRound = 0;
                } else {
                    pendingRound = totalrounds - previousround;
                    completeRound = previousround;
                }
                //console.log(completeRound, pendingRound);
                if (completeRound > 0) {
                    for (let i = 1; i <= completeRound; i++) {
                        var objectUserRound = {};
                        isusereligible = true;
                        var isDidUserplaygame = true;
                        var isDidUserWin = true;
                        if (i == completeRound) {
                            isDidUserplaygame = diduserplaygame;
                            isDidUserWin = diduserwin;
                        } else {
                            isDidUserplaygame = isDidUserplaygame;
                            isDidUserWin = isDidUserWin;
                        }
                        if (diduserwin) {
                            isDidUserplaygame = true;
                        }
                        roundnumber += 1;
                        objectUserRound = {
                            roundnumber: parseInt(roundnumber),
                            isusereligible: isusereligible,
                            diduserwin: isDidUserWin,
                            diduserplaygame: isDidUserplaygame,
                        };
                        arrayOfUserRounds.push(objectUserRound);
                    }
                }

                if (pendingRound > 0) {
                    for (let i = 1; i <= pendingRound; i++) {
                        var objectUserRound = {};
                        if (diduserwin && i == 1) {
                            isusereligible = true;
                        } else {
                            if (pendingRound == totalrounds && i == 1) {
                                isusereligible = true;
                            } else {
                                isusereligible = false;
                            }
                        }
                        diduserwin = false;
                        diduserplaygame = false;
                        roundnumber += 1;
                        objectUserRound = {
                            roundnumber: parseInt(roundnumber),
                            isusereligible: isusereligible,
                            diduserwin: diduserwin,
                            diduserplaygame: diduserplaygame,
                        };
                        arrayOfUserRounds.push(objectUserRound);
                    }
                }
                ////
                //// Every Time fetch issue by loadsh then use to for loop
                ////

                for (
                    let index = 0; index < getRounds.length, index < arrayOfUserRounds.length; index++
                ) {
                    // const roundentrystartdatetime =
                    //   getRounds[index].roundentrystartdatetime;
                    const roundentrystartdatetime = momentTimezone.utc(getRounds[index].roundentrystartdatetime).tz("Asia/Kolkata").format('DD-MMM-YYYY hh:mm A');
                    // const roundstarttime = getRounds[index].roundstarttime;
                    const roundstarttime = momentTimezone.utc(getRounds[index].roundstarttime).tz("Asia/Kolkata").format('DD-MMM-YYYY hh:mm A');
                    const roundpoints = getRounds[index].roundpoints;
                    const isfirstround = getRounds[index].isfirstround;
                    const roundnumber = getRounds[index].roundnumber;
                    const roundstatus = getRounds[index].roundstatus;
                    var objectRound = {
                        roundentrystartdatetime: roundentrystartdatetime, //// Date - 28-10-2021 by Nikhil -- Problem on Application
                        roundstarttime: roundstarttime, //// Date - 28-10-2021 by Nikhil -- Problem on Application 
                        roundpoints: roundpoints,
                        isfirstround: isfirstround,
                        roundnumber: roundnumber,
                        roundstatus: roundstatus,
                        isusereligible: arrayOfUserRounds[index].isusereligible,
                        diduserplaygame: arrayOfUserRounds[index].diduserplaygame,
                        diduserwin: arrayOfUserRounds[index].diduserwin,
                    };
                    arrayOfrounds.push(objectRound);
                }
                return {
                    status: true,
                    listofround: arrayOfrounds,
                };
            } else {
                return {
                    status: false,
                    msg: "There are no rounds for this tournament. Please come back later to check the round schedule."
                };
            }
        } else {
            return {
                status: false,
                msg: "You are not registered for this tournament.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Tournament Round Play
async function playroundTournament(params) {
    try {
        const { tournamentid, username, roundnumber, roundstatus, connectionid } =
            params;
        // count -- User Register
        var getUserTournamet = await TournamentUser.countDocuments({
            $and: [{ username: username, tournamentid: tournamentid }],
        });
        // get - registeropendatetime, registerclosedatetime, type, status, maxplayers,
        var getTournament = await Tournament.findById(tournamentid).select({
            type: 1,
            rounds: 1,
        });
        if (getUserTournamet == 1) {
            var getRounds = getTournament.rounds;
            if (getRounds.length > 0) {
                var getUserRounds = await TournamentUser.findOne({ $and: [{ username: username, tournamentid: tournamentid }] }, {
                    isusereligible: 1,
                    diduserplaygame: 1,
                    diduserwin: 1,
                    previousround: 1,
                    nextround: 1,
                });

                var getRoundsPerUser = await lodashfilter(getRounds, {
                    roundnumber: roundnumber,
                });

                /// Check Username
                if (getRoundsPerUser.length > 0) {
                    const roundentrystartdatetime =
                        getRoundsPerUser[0].roundentrystartdatetime;
                    const roundstarttime = getRoundsPerUser[0].roundstarttime;
                    // const isfirstround = getRoundsPerUser[0].isfirstround
                    // const diduserwin = getRoundsPerUser[0].diduserwin;
                    var openadmission = moment(roundentrystartdatetime);
                    var closeadmission = moment(roundstarttime);
                    var currentdate = moment(new Date());
                    var differentOpen = currentdate.diff(openadmission, "seconds"); // Enter Time
                    var differentClosed = closeadmission.diff(currentdate, "seconds"); // Wait Time
                    var differentAdmission = closeadmission.diff(
                        openadmission,
                        "seconds"
                    ); // Total Time
                    if (
                        differentOpen > 0 &&
                        differentClosed > 0 &&
                        getUserRounds.isusereligible == true &&
                        roundnumber == getRoundsPerUser[0].roundnumber
                    ) {
                        await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
                            $set: {
                                connectionid: connectionid,
                            },
                        });
                        var display = moment
                            .duration(differentAdmission, "seconds")
                            .format("h:mm:ss");
                        return {
                            status: true,
                            waittime: differentClosed,
                            totaltime: display,
                        };
                    } else if (differentOpen <= 0) {
                        // //console.log(
                        //     "Tournamet Round on after this seconds",
                        //     Math.abs(differentOpen)
                        // );
                        // //console.log(differentOpen, differentClosed, differentAdmission);
                        var minuteDifferenopen = Math.abs(differentOpen);
                        var display = moment
                            .duration(minuteDifferenopen, "seconds")
                            .format("d[d] h:mm:ss");
                        return {
                            status: false,
                            msg: `Round entry not yet open. Please enter at the Round Entry Time.`,
                            // msg: `You have not entry this tournament. Tournamet Round on after ${display}.`,
                            waittime: minuteDifferenopen,
                        };
                    } else if (differentClosed <= 0) {

                        // TO DO : closetime and display Removed
                        // //console.log("Round close this seconds", Math.abs(differentClosed));
                        // //console.log(differentOpen, differentClosed, differentAdmission);
                        var minuteDifferenclose = Math.abs(differentClosed);
                        var display = moment
                            .duration(minuteDifferenclose, "seconds")
                            .format("d[d] h:mm:ss");
                        return {
                            status: false,
                            // msg: `You have not entry this tournament. Start Tournamet Round on before ${display}.`,
                            msg: `You are late. You cannot enter this round now.`,
                            closetime: minuteDifferenclose,
                        };
                    }
                } else {
                    return {
                        status: false,
                        msg: "You can not enter this round.",
                    };
                }
            } else {
                return {
                    status: false,
                    msg: "There are no rounds for this tournament. Please come back later to check the round schedule.",
                };
            }
        } else {
            return {
                status: false,
                msg: "You are not registered for this tournament. ",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Exit Tournament ---
async function exitroundTournament(params) {
    try {
        const { tournamentid, username } = params;
        var getUserRounds = await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
            $set: {
                connectionid: "",
            },
        }, { fields: { _id: 0 } });
        return {
            status: true,
            msg: "Make sure you return before the round starts.",
        };
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Win Round Tournament
async function winroundTournament(params) {
    try {
        const {
            tournamenttype,
            username,
            isLastgame,
            isSingleplayer,
            tournamentid,
            AdsVersionMultiplayerPlayOnline,
            isWin,
            roundnumber,
        } = params;
        var multipayerupdatePoint;
        if (isWin) {
            // if(roundnumber == 0) {
            //     await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
            //         $set: {
            //             isusereligible: true, diduserplaygame: false, connectionid: ""
            //         },
            //         $inc: {
            //             previousround: parseInt(1),
            //             nextround: parseInt(1),
            //         }
            //     }, { "fields": { _id: 1 } });
            // } else {
            await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
                $set: {
                    isusereligible: true,
                    diduserplaygame: false,
                    connectionid: "",
                    diduserwin: true,
                },
            }, { fields: { _id: 1 } });
            // }
        } else {
            await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
                $set: {
                    isusereligible: false,
                    diduserplaygame: true,
                    connectionid: "",
                    diduserwin: false,
                },
            }, { fields: { _id: 1 } });
        }
        if (isWin) {
            var winPoint = 0;
            if (isLastgame || isSingleplayer) {
                await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
                    $set: {
                        isusereligible: false,
                        diduserplaygame: false,
                    },
                }, { fields: { _id: 1 } });
                if (tournamenttype == "SUPER") {
                    await Tournament.updateMany({ winner: { $exists: true } }, { $set: { isactive: false } });

                }
                var getTournament = await Tournament.findByIdAndUpdate(
                    tournamentid, { $set: { status: "COMPLETE", winner: username } }, { new: true, fields: { winnerpoint: 1, _id: 0 } }
                );
                winPoint = getTournament.winnerpoint;
                // await Tournament.updateOne({ _id: mongoose.Types.ObjectId(tournamentid), "rounds.roundnumber": { $gt: roundnumber } }, { $set: { "rounds.$.roundstatus": "CANCEL" } });
            }
            if (AdsVersionMultiplayerPlayOnline == true) {
                const { roundpoints } = params;
                winPoint = winPoint + roundpoints;
                multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                    $inc: {
                        hatsonpoints: winPoint,
                        totalhatsonpoints: winPoint,
                        hatsonpointswin: 1,
                    },
                }, {
                    new: true,
                    fields: { currentbalanceofpoints: 1, hatsonpoints: 1, _id: 0 },
                });
            }
            if (AdsVersionMultiplayerPlayOnline == false) {
                const { roundpoints } = params;
                winPoint = winPoint + roundpoints;
                multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                    $inc: {
                        currentbalanceofpoints: winPoint,
                        totalwinningpoints: winPoint,
                        totalwin: 1,
                    },
                }, {
                    new: true,
                    fields: { currentbalanceofpoints: 1, hatsonpoints: 1, _id: 0 },
                });
            }
            return {
                status: true,
                userWinUpdate: {
                    currentbalanceofpoints: multipayerupdatePoint.currentbalanceofpoints,
                    hpoint: multipayerupdatePoint.hatsonpoints,
                    winPoint: winPoint,
                    isLastgame: isLastgame,
                    isSingleplayer: isSingleplayer
                },
            };
        } else {
            var winPoint = 0;
            if (AdsVersionMultiplayerPlayOnline == true) {
                const { roundpoints } = params;
                winPoint = roundpoints;
                multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                    $inc: {
                        hatsonpoints: roundpoints,
                        totalhatsonpoints: roundpoints,
                    },
                }, {
                    new: true,
                    fields: { currentbalanceofpoints: 1, hatsonpoints: 1, _id: 0 },
                });
            }
            if (AdsVersionMultiplayerPlayOnline == false) {
                const { roundpoints } = params;
                winPoint = roundpoints;
                multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                    $inc: {
                        currentbalanceofpoints: roundpoints,
                        totalwinningpoints: roundpoints,
                    },
                }, {
                    new: true,
                    fields: { currentbalanceofpoints: 1, hatsonpoints: 1, _id: 0 },
                });
            }
            return {
                status: true,
                userWinUpdate: {
                    currentbalanceofpoints: multipayerupdatePoint.currentbalanceofpoints,
                    hpoint: multipayerupdatePoint.hatsonpoints,
                    winPoint: winPoint,
                    isLastgame: isLastgame,
                    isSingleplayer: isSingleplayer
                },
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Exit Tournament Before Play
async function exitroundafterplayroundTournament(params) {
    try {
        const { username, tournamentid, AdsVersionMultiplayerPlayOnline } = params;
        var multipayerupdatePoint;
        var roundPoints;
        await TournamentUser.findOneAndUpdate({ $and: [{ username: username, tournamentid: tournamentid }] }, {
            $set: {
                isusereligible: false,
                diduserplaygame: false,
            },
        }, { fields: { _id: 1 } });
        if (AdsVersionMultiplayerPlayOnline == true) {
            const { roundpoints } = params;
            roundPoints = roundpoints;
            multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                $inc: {
                    hatsonpoints: roundpoints,
                    totalhatsonpoints: roundpoints,
                },
            }, {
                new: true,
                fields: { currentbalanceofpoints: 1, hatsonpoints: 1, _id: 0 },
            });
        }
        if (AdsVersionMultiplayerPlayOnline == false) {
            const { roundpoints } = params;
            roundPoints = roundpoints;
            multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                $inc: {
                    currentbalanceofpoints: roundpoints,
                    totalwinningpoints: roundpoints,
                },
            }, {
                new: true,
                fields: { currentbalanceofpoints: 1, hatsonpoints: 1, _id: 0 },
            });
        }
        return {
            status: true,
            userWinUpdate: {
                currentbalanceofpoints: multipayerupdatePoint.currentbalanceofpoints,
                hpoint: multipayerupdatePoint.hatsonpoints,
                winPoint: roundPoints,
            },
        };
    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}



module.exports = {
    listAllTournament,
    registerTournament,
    roundTournament,
    playroundTournament,
    exitroundTournament,
    winroundTournament,
    exitroundafterplayroundTournament,
};

// for (let index = 0; index < getRounds.length; index++) {
//     const roundentrystartdatetime = getRounds[index].roundentrystartdatetime;
//     const roundstarttime = getRounds[index].roundstarttime;
//     const roundpoints = getRounds[index].roundpoints;
//     const isfirstround = getRounds[index].isfirstround;
//     const roundnumber = getRounds[index].roundnumber;
//     const roundstatus = getRounds[index].roundstatus;
//     var isUserEligible = false;
//     var isDidUserplaygame = false;
//     var isDidUserWin = false;
//     if (roundnumber == 1 && roundstatus == "ACTIVE" && isfirstround) {
//         if (getUserRounds.previousround == 0) {
//             isUserEligible = true;
//         } else {
//             isDidUserplaygame = true;
//             if (getUserRounds.diduserwin) {
//                 isDidUserWin = true;
//             }
//             if (index < getUserRounds.previousround) {
//                 isDidUserWin = true;
//             }
//         }
//     } else if (roundnumber > 1 && roundstatus == "ACTIVE") {
//         if (index == getUserRounds.previousround && index > 1) {
//             if (getUserRounds.diduserwin && getUserRounds.isusereligible) {
//                 isUserEligible = true;
//             }
//         }
//         if (index < getUserRounds.previousround) {
//             isDidUserplaygame = true;
//             isDidUserWin = true;
//         }
//         if (index == getUserRounds.nextround && index > 1) {
//             isUserEligible = getUserRounds.isusereligible;
//             isDidUserplaygame = getUserRounds.diduserplaygame;
//             isDidUserWin = getUserRounds.diduserwin;
//         }
//     }
//     var objectRound = {
//         roundentrystartdatetime: roundentrystartdatetime,
//         roundstarttime: roundstarttime,
//         roundpoints: roundpoints,
//         isfirstround: isfirstround,
//         roundnumber: roundnumber,
//         roundstatus: roundstatus,
//         isusereligible: isUserEligible,
//         diduserplaygame: isDidUserplaygame,
//         diduserwin: isDidUserWin,
//         previousround: getUserRounds.previousround,
//         nextround: getUserRounds.nextround
//     }
//     arrayOfrounds.push(objectRound);
// }