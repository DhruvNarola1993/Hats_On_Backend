const { countLobby, countRoom, insertLobby, playerLobbyForStart, playerLobbyForLevel, playerLobbyForCritical, createRoom, aferForCriticalTime, playerExitLobby, isUpdateCritical, isUpdateSingleAlonePlayer, isUpdateLobby, multiplayerWinplayer, returnCoinOrPoint, adsVesionAddPoint, restartCoinOrPoint } = require('../services/lobby.service');
var commonValidator = require('../common/common.validator');
var Lobby = require('../models/lobby.model');
var Room = require('../models/room.model');
var timerStop_1, timerStop_2, timerStop_3, timerStop_4;
// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player
//
// Rule 3.2.1 :  2-player Contest Rooms, 4-player Contest Room, 6-player Contest Room 
// Scenario 1
//
async function isInitRoomValidator(payload) {
    try {
        var countLobbyPerUser = await countLobby(payload);
        var countRoomPerUser = await countRoom(payload);
        if (countLobbyPerUser.status && countRoomPerUser.status) {
            var iLobby = await insertLobby(payload);
            var insertRoom;
            if (iLobby.status) {
                // //console.log("Insert Lobby ", iLobby);
                var jointPlayerForInit = await playerLobbyForStart(payload);
                //
                // res:waitime -->  Timer Code 0 -- Room Create and send both player
                //
                if (jointPlayerForInit.status) {
                    //
                    // Return Room And Player 
                    //
                    if (jointPlayerForInit.code == 0) {
                        var player = jointPlayerForInit.otherplayer;
                        player.push(iLobby.ownplayer);
                        insertRoom = await createRoom(jointPlayerForInit);  // Exit in Lobby and Enter in Room - No Flag Issue
                        return insertRoom;
                    }
                    // 
                    //  res:waitime -->  Timer Code 1 -- Waiting Time
                    //
                    else {
                        _common.sendMsgToSingleUser(IO, payload.connectionid, "res:roomname", {
                            status: true,
                            msg: "Waiting to other player..."
                        });

                        timerStop_1 = setTimeout(async () => {
                            await isWaitTimeValidator(payload, iLobby);
                            // No wait for other player for Level Matchmaking
                            ////// (payload.waitingtime - payload.rescuetime) *
                        }, (payload.waitingtime - 8) * 1000); // 52 - 2

                        timerStop_2 = setTimeout(async () => {
                            await isUpdateCritical(payload);
                        }, (payload.waitingtime - payload.rescuetime - 8) * 1000); // 47 

                        timerStop_3 = setTimeout(async () => {
                            await isUpdateSingleAlonePlayer(payload);
                        }, (payload.waitingtime - 8) * 1000); // 52

                        // setTimeout(async() => {
                        //     await isUpdateLobby(payload);
                        // }, (payload.waitingtime + 2) * 1000); // 63 -- Not Joint
                    }
                }
                // 
                //  res:waitime -->  Timer Code 1 -- Waiting Time
                //
                else {
                    return jointPlayerForInit;
                }
            } else {
                return iLobby;
            }
        } else {
            if (!countLobbyPerUser.status)
                return countLobbyPerUser;
            else if (!countRoomPerUser.status)
                return countRoomPerUser;
        }
    } catch (error) {
        //console.log("Init Room , " + error);
        return {
            status: false,
            msg: error
        };
    }
}


// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player
//
// Rule 3.2.2 :  2-player Contest Rooms, 4-player Contest Room, 6-player Contest Room 
// Scenario 2
//
async function isWaitTimeValidator(payload, iLobby) {
    try {
        var jointPlayerForLevel = await playerLobbyForLevel(payload);
        if (jointPlayerForLevel.status) {
            if (jointPlayerForLevel.code == 0) {
                var levelplayer = jointPlayerForLevel.otherplayer;
                levelplayer.push(iLobby.ownplayer);
                insertRoom = await createRoom(jointPlayerForLevel);
                return insertRoom;
            } else {
                setTimeout(async () => {
                    var checkCritical = await isCriticalTimevalidator(payload, iLobby);
                    setTimeout(async () => {
                        if (checkCritical != undefined) {
                            if (checkCritical.status != undefined) {
                                if (checkCritical.status == false) {
                                    await isUpdateLobby(payload);
                                    // var countLobby = await Lobby.find({ username: { $ne: iLobby.ownplayer.username }, isLobby: false }, {
                                    //     username: 1,
                                    //     userlevelno: 1,
                                    //     userrateno: 1,
                                    //     levelno: 1,
                                    //     point: 1,
                                    //     rateno: 1,
                                    //     minplayer: 1,
                                    //     maxplayer: 1,
                                    //     isJoint: 1,
                                    //     createdate: 1
                                    // });
                                    var countLobby = await Lobby.aggregate([
                                        { $match: { username: { $ne: iLobby.ownplayer.username }, isLobby: true, isJoint: false } },
                                        {
                                            $group: {
                                                _id: { "point": "$point", "maxplayer": "$maxplayer" }, currentplayer: { $sum: 1 },
                                                levelid: { "$first": "$levelid" },
                                                ratingid: { "$first": "$ratingid" },
                                                levelno: { "$first": "$levelno" },
                                                rateno: { "$first": "$rateno" },
                                                minplayer: { "$first": "$minplayer" },
                                                winlevel: { "$first": "$winlevel" }
                                            }
                                        },
                                        { $project: { _id: 1, currentplayer: 1, levelid: 1, ratingid: 1, levelno: 1, rateno: 1, winlevel: 1, minplayer: 1 } }
                                    ]);
                                    var currentUser = await Lobby.countDocuments({ username: payload.username, isLobby: false });
                                    var currentRoomUser = await Room.countDocuments({ "userlist.username": payload.username });
                                    if (countLobby.length == 0) { }
                                    if (currentUser == 1 && currentRoomUser == 0) {
                                        var newResponse = [];
                                        //// Date - 07/09/2021 -- Add kari ne apyo
                                        if (countLobby.length > 0) {
                                            for (let index = 0; index < countLobby.length; index++) {
                                                const point = countLobby[index]._id.point;
                                                const maxplayer = countLobby[index]._id.maxplayer;
                                                var obj = {
                                                    point: point,
                                                    maxplayer: maxplayer,
                                                    minplayer: countLobby[index].minplayer,
                                                    winlevel: countLobby[index].winlevel,
                                                    movelevelid: "",
                                                    levelid: countLobby[index].levelid,
                                                    ratingid: countLobby[index].ratingid,
                                                    levelno: countLobby[index].levelno,
                                                    rateno: countLobby[index].rateno,
                                                    currentplayer: countLobby[index].currentplayer
                                                }
                                                newResponse.push(obj);
                                            }
                                        }
                                        _common.sendMsgToSingleUser(IO, payload.connectionid, "res:playerlist", {
                                            status: true,
                                            msg: "Other player room...",
                                            listofanother: newResponse
                                        });
                                    }


                                }

                            }

                        }

                    }, 2100); // is lobby false

                }, 4100); // anybody joint to more than 55 seconds - iscritical - true

                // return jointPlayerForLevel;
            }
        } else {
            return jointPlayerForLevel;
        }
    } catch (error) {
        //console.log("Wait Time , " + error);
        return {
            status: false,
            msg: error
        };
    }
}



// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player
//
// Rule 3.2.2 :  2-player Contest Rooms, 4-player Contest Room, 6-player Contest Room 
// Scenario 2
//
async function isCriticalTimevalidator(payload, iLobby) {
    try {
        var jointPlayerForCritical = await playerLobbyForCritical(payload);
        if (jointPlayerForCritical.status) {
            var levelplayer = jointPlayerForCritical.otherplayer;
            levelplayer.push(iLobby.ownplayer);
            insertRoom = await createRoom(jointPlayerForCritical);
            return insertRoom;
        } else {
            return jointPlayerForCritical;
        }
    } catch (error) {
        //console.log("Critical Time , " + error);
        return {
            status: false,
            msg: error
        };
    }
}

// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player
//
// Rule 3
// Scenario 3.3 And 3.4
//
async function isAferForCriticalTimeValidator(payload) {
    try {
        var AferForCriticalTime = await aferForCriticalTime(payload);
        if (AferForCriticalTime.status) {
            var insertRoom = await createRoom(AferForCriticalTime);
            return insertRoom;
        } else {
            return AferForCriticalTime;
        }
    } catch (error) {
        //console.log("After Critical Time , " + error);
        return {
            status: false,
            msg: error
        };
    }
}


//
// Exit for lobby player
//
async function exitTimeValidator(payload) {
    try {
        var exitLobby = await playerExitLobby(payload);
        clearTimeout(timerStop_1);
        clearTimeout(timerStop_2);
        clearTimeout(timerStop_3);
        // clearTimeout(timerStop_4);
        // timerStop_1, timerStop_2, timerStop_3, timerStop_4
        return exitLobby;
    } catch (error) {
        //console.log("Exit On Waiting Time , " + error);
        return {
            status: false,
            msg: error
        };
    }
}

// Win Multiplayer 
async function multiplayerwingame(payload) {
    try {
        const { username, roomname, type } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        var errorMsgCoin = await commonValidator.notEmptyAndNull(roomname);
        var errorType = await commonValidator.notEmptyAndNull(type);
        if (errorMsgUserid.status && errorMsgCoin.status && errorType.status) {
            var errorService = await multiplayerWinplayer(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
            else if (!errorMsgCoin.status)
                return errorMsgCoin;
            else if (!errorType.status)
                return errorType;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


// Retrun Point or Coin
async function returncoinpoint(payload) {
    try {
        const { username, point, hpoint } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        var errorMsgPoint = await commonValidator.isNumber(point);
        var errorMsgCoin = await commonValidator.isNumber(hpoint);
        if (errorMsgUserid.status && errorMsgCoin.status && errorMsgPoint.status) {
            var errorService = await returnCoinOrPoint(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
            else if (!errorMsgCoin.status)
                return errorMsgCoin;
            else if (!errorMsgPoint.status)
                return errorMsgPoint;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


// Ads Version Point -- Multiplayer
async function adsvesionaddpoint(payload) {
    try {
        const { username, hpoint } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        var errorMsgPoint = await commonValidator.isNumber(hpoint);
        if (errorMsgUserid.status && errorMsgPoint.status) {
            var errorService = await adsVesionAddPoint(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
            else if (!errorMsgPoint.status)
                return errorMsgPoint;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


// Restart Point or Coin
async function restartcoinpoint(payload) {
    try {
        const { username } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        if (errorMsgUserid.status) {
            var errorService = await restartCoinOrPoint(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { isInitRoomValidator, isWaitTimeValidator, isCriticalTimevalidator, isAferForCriticalTimeValidator, exitTimeValidator, multiplayerwingame, returncoinpoint, adsvesionaddpoint, restartcoinpoint };

// async function sleepTimer(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }

// function sleep(milliseconds) {
//     var start = new Date().getTime();
//     for (var i = 0; i < 1e7; i++) {
//         if ((new Date().getTime() - start) > milliseconds) {
//             break;
//         }
//     }
// }