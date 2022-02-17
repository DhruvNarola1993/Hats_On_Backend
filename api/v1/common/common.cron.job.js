var cron = require('node-cron');
var moment = require("moment");
var _ = require("lodash");
const Hashids = require('hashids/cjs');
const { v4: uuidv4 } = require('uuid');
var User = require("../models/user.model");
var Tournament = require('../models/tournament.model');
var TournamentUser = require('../models/tournamentuser.model');

cron.schedule('*/01 * * * * *', async () => {
    runEverySecond(); // Run Every Second --- Tournament Play 
});


var totalroom = -1;


/***
 * 
 * @description Chcek Evary Time Tournament Start and not
 * 
 */
async function runEverySecond() {
    /// count -- User Register
    try {
        // //console.log(new Date())
        await User.updateMany({}, { $set: { online: false } });
        var getTournament = await Tournament.find({ "rounds.roundstarttime": { $gte: new Date() }, "status": "ACTIVE" }).select({ type: 1, "rounds.$": 1 });

        if (getTournament.length > 0) {
            for (let index = 0; index < getTournament.length; index++) {
                /// Handle Many Tournamnet 
                if (getTournament[index].rounds.length > 0) {
                    var getTournamentId = getTournament[index]._id;
                    // //console.log(getTournament);
                    var openadmission = moment(getTournament[index].rounds[0].roundentrystartdatetime);
                    var closeadmission = moment(getTournament[index].rounds[0].roundstarttime);
                    var currentdate = moment(new Date());
                    var dayDifferent = closeadmission.diff(currentdate, 'day');
                    // //console.log(dayDifferent)
                    if (dayDifferent == 0) {
                        var differentOpen = currentdate.diff(openadmission, 'seconds');  // Enter Time
                        var differentClosed = closeadmission.diff(currentdate, 'seconds'); // Wait Time
                        var differentAdmission = closeadmission.diff(openadmission, 'seconds'); // Total Time
                        //console.log(differentOpen, differentClosed, differentAdmission);
                        if (differentClosed == 0) {
                            // //console.log(differentOpen, differentClosed, differentAdmission, getTournamentId);

                            var getUserTournamet = await TournamentUser.find({ tournamentid: getTournamentId, connectionid: { $ne: "" } }).select({ username: 1, connectionid: 1, _id: 0 });
                            if (getUserTournamet != undefined) {
                                if (getUserTournamet.length > 0) {
                                    // //console.log('Function call');
                                    // When Play User Tournament
                                    await TournamentUser.updateMany({ tournamentid: getTournamentId, connectionid: { $ne: "" } }, { $set: { diduserplaygame: true }, $inc: { previousround: 1, nextround: 1 } });
                                    // Not Play User Tournament
                                    await TournamentUser.updateMany({ tournamentid: getTournamentId, connectionid: "" }, { $set: { isusereligible: false } });
                                    var getUserIds = _.map(getUserTournamet, 'username');
                                    // //console.log(getUserTournamet.length, getUserIds, getUserTournamet)
                                    await player(getUserTournamet.length, getUserIds, getUserTournamet)
                                }
                            }
                        } else {
                            //console.log('&&&&&&&&&&&&&&&&&&&&&&');
                        }
                    } else {
                        //console.log('&&&&&&&&&&&&&&&&&&&&&&');
                    }
                }
            }

        } else {

        }

    } catch (error) {
        //console.log(error);
    }
    // get - registeropendatetime, registerclosedatetime, type, status, maxplayers,
}


/**
* @description Tournament User connect or not
*/
async function player(totalplayer, playerlist, userInfo) {
    try {
        if (totalplayer == 1) {
            totalroom = 0;
            const chunks = _.chunk(playerlist, totalplayer);
            for (let index = 0; index < chunks.length; index++) {
                const element = chunks[index];
                const roomname = new Hashids(uuidv4() + element[0] + new Date(), 8);
                var sendData = {
                    totalroom: totalroom,
                    totalplayer: totalplayer,
                    isLastgame: true,
                    isSingleplayer: true,
                    roomname: roomname.encode(1, 2, 3),
                    roomlimit: element.length,
                    roomPlayer: element
                };
                for (let indexUser = 0; indexUser < element.length; indexUser++) {
                    const elementuser = element[indexUser];
                    var sendOnSocket = _.filter(userInfo, ['username', elementuser])[0];
                    if (sendOnSocket.connectionid != "") {
                        _common.sendMsgToSingleUser(IO, sendOnSocket.connectionid, "res:StartRoundForTournament", {
                            status: true,
                            startRoundTournament: sendData
                        });
                    }
                }
            }

        } else if (totalplayer > 1 && totalplayer <= 6) {
            totalroom = 1;
            const chunks = _.chunk(playerlist, totalplayer);
            for (let index = 0; index < chunks.length; index++) {
                const element = chunks[index];
                const roomname = new Hashids(uuidv4() + element[0] + new Date(), 8);
                var sendData = {
                    totalroom: totalroom,
                    totalplayer: totalplayer,
                    isLastgame: true,
                    isSingleplayer: false,
                    roomname: roomname.encode(1, 2, 3),
                    roomlimit: element.length,
                    roomPlayer: element
                };
                for (let indexUser = 0; indexUser < element.length; indexUser++) {
                    const elementuser = element[indexUser];
                    var sendOnSocket = _.filter(userInfo, ['username', elementuser])[0];
                    if (sendOnSocket.connectionid != "") {
                        _common.sendMsgToSingleUser(IO, sendOnSocket.connectionid, "res:StartRoundForTournament", {
                            status: true,
                            startRoundTournament: sendData
                        });
                    }
                }
            }
        } else if (totalplayer > 6) {
            if (totalplayer == 7) {
                var newRoomplayer = totalplayer % 5;
                const chunks = _.chunk(playerlist, 5);
                totalRoom = 2;
                for (let index = 0; index < chunks.length; index++) {
                    const element = chunks[index];
                    const roomname = new Hashids(uuidv4() + element[0] + new Date(), 8);
                    var sendData = {
                        totalroom: totalRoom,
                        totalplayer: totalplayer,
                        isLastgame: false,
                        isSingleplayer: false,
                        roomname: roomname.encode(1, 2, 3),
                        roomlimit: element.length,
                        roomPlayer: element
                    };
                    for (let indexUser = 0; indexUser < element.length; indexUser++) {
                        const elementuser = element[indexUser];
                        var sendOnSocket = _.filter(userInfo, ['username', elementuser])[0];
                        if (sendOnSocket.connectionid != "") {
                            _common.sendMsgToSingleUser(IO, sendOnSocket.connectionid, "res:StartRoundForTournament", {
                                status: true,
                                startRoundTournament: sendData
                            });
                        }
                    }
                }
            } else {
                var availableUser = totalplayer % 6;
                var totalRoom = totalplayer / 6;
                if (availableUser == 0) {
                    const chunks = _.chunk(playerlist, 6);
                    for (let index = 0; index < chunks.length; index++) {
                        const element = chunks[index];
                        const roomname = new Hashids(uuidv4() + element[0] + new Date(), 8);
                        var sendData = {
                            totalroom: totalRoom,
                            totalplayer: totalplayer,
                            isLastgame: false,
                            isSingleplayer: false,
                            roomname: roomname.encode(1, 2, 3),
                            roomlimit: element.length,
                            roomPlayer: element
                        };
                        for (let indexUser = 0; indexUser < element.length; indexUser++) {
                            const elementuser = element[indexUser];
                            var sendOnSocket = _.filter(userInfo, ['username', elementuser])[0];
                            if (sendOnSocket.connectionid != "") {
                                _common.sendMsgToSingleUser(IO, sendOnSocket.connectionid, "res:StartRoundForTournament", {
                                    status: true,
                                    startRoundTournament: sendData
                                });
                            }
                        }
                    }
                } else if (availableUser == 1) {
                    totalRoom = parseInt(totalRoom) - 1;
                    var playerCount = totalRoom * 6;
                    var chunks;
                    if (totalRoom == 1) {
                        var tempChunks = _.chunk(playerlist, playerCount);
                        var finalChuks = tempChunks[0];
                        var firstChunks = tempChunks[1];
                        var secondChunks = tempChunks[2];
                        firstChunks.push(secondChunks[0]);
                        delete tempChunks[1];
                        delete tempChunks[2];
                        var newRoomplayer = (firstChunks.length) % 5;
                        chunks = _.chunk(finalChuks, 6);
                        var pchunks = _.chunk(firstChunks, 5);
                        chunks.push(pchunks[0]);
                        totalRoom += 1;
                        if (newRoomplayer > 0) {
                            totalRoom += 1;
                            chunks.push(pchunks[1]);
                        }

                    } else {
                        chunks = _.chunk(playerlist, playerCount);
                        var firstChunks = chunks[0];
                        var secondChunks = chunks[1];
                        chunks = _.chunk(firstChunks, 6);
                        var pendingPlayer = totalplayer - (totalRoom * 6);
                        var newRoomplayer = pendingPlayer % 5;
                        var pchunks = _.chunk(secondChunks, 5);
                        chunks.push(pchunks[0]);
                        totalRoom += 1;
                        if (newRoomplayer > 0) {
                            totalRoom += 1;
                            chunks.push(pchunks[1]);
                        }
                    }
                    for (let index = 0; index < chunks.length; index++) {
                        const element = chunks[index];
                        const roomname = new Hashids(uuidv4() + element[0] + new Date(), 8);
                        var sendData = {
                            totalroom: totalRoom,
                            totalplayer: totalplayer,
                            isLastgame: false,
                            isSingleplayer: false,
                            roomname: roomname.encode(1, 2, 3),
                            roomlimit: element.length,
                            roomPlayer: element
                        };
                        for (let indexUser = 0; indexUser < element.length; indexUser++) {
                            const elementuser = element[indexUser];
                            var sendOnSocket = _.filter(userInfo, ['username', elementuser])[0];
                            if (sendOnSocket.connectionid != "") {
                                _common.sendMsgToSingleUser(IO, sendOnSocket.connectionid, "res:StartRoundForTournament", {
                                    status: true,
                                    startRoundTournament: sendData
                                });
                            }
                        }
                    }
                } else if (availableUser > 1) {
                    totalRoom = parseInt(totalRoom) + 1;
                    const chunks = _.chunk(playerlist, 6);
                    for (let index = 0; index < chunks.length; index++) {
                        const element = chunks[index];
                        const roomname = new Hashids(uuidv4() + element[0] + new Date(), 8);
                        var sendData = {
                            totalroom: totalRoom,
                            totalplayer: totalplayer,
                            isLastgame: false,
                            isSingleplayer: false,
                            roomname: roomname.encode(1, 2, 3),
                            roomlimit: element.length,
                            roomPlayer: element
                        };
                        for (let indexUser = 0; indexUser < element.length; indexUser++) {
                            const elementuser = element[indexUser];
                            var sendOnSocket = _.filter(userInfo, ['username', elementuser])[0];
                            if (sendOnSocket.connectionid != "") {
                                _common.sendMsgToSingleUser(IO, sendOnSocket.connectionid, "res:StartRoundForTournament", {
                                    status: true,
                                    startRoundTournament: sendData
                                });
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        //console.log(error);
    }

}