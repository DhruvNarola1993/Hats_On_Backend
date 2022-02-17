var Room = require('../models/room.model');
var FriendRoom = require('../models/friend.room.model');
var Lobby = require('../models/lobby.model');
const Hashids = require('hashids/cjs');
const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');
const User = require('../models/user.model');

// Count User in Lobby
async function countLobby(params) {
    try {
        const { username } = params;
        await Lobby.deleteMany({ username: username });
        var findLobby = await Lobby.countDocuments({ username: username });
        if (findLobby == 0) {
            return {
                status: true
            };
        } else {
            await Lobby.deleteMany({ username: username });
            return {
                status: true
            };
        }
    } catch (error) {
        //console.log("Count Lobby , " + error);
        return {
            status: false
        };
    }
}

// Count User in Room 
async function countRoom(params) {
    try {
        const { username } = params;
        var findLobby = await Room.countDocuments({ "userlist.username": username });
        if (findLobby == 0) {
            return {
                status: true
            };
        } else {
            await Room.deleteMany({ "userlist.username": username });
            return {
                status: true
            };
        }
    } catch (error) {
        //console.log("Count Room , " + error);
        return {
            status: false
        };
    }
}


// Insert in Lobby
async function insertLobby(params) {
    try {
        var saveLobby = await new Lobby(params);
        saveLobby.save();
        if (saveLobby != undefined) {
            return {
                status: true,
                ownplayer: saveLobby
            };
        } else {
            return {
                status: false
            };
        }
    } catch (error) {
        //console.log("Insert Lobby , " + error);
        return {
            status: false
        };
    }
}


/*
#############################################################################################
                                    WAITING PLAYER OR NOT
#############################################################################################
*/
// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player, 4 Player, 6 player
//
// Rule 3.2.1 :  2-player Contest Rooms, 4-player Contest Room, 6-player Contest Room 
// Scenario 1 
// Scenario 2 Case 1
//
async function playerLobbyForStart(params) {
    try {
        const { levelno, point, rateno, username, maxplayer } = params;
        var otherPlayer;
        // 
        //  Wait Timer Code 0 -- Room Create and send both player
        //
        if (maxplayer == 2) {
            otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, maxplayer: 2, isLobby: true, isJoint: false });
            ////
            //// Rule 3.2.1 :  2-player Contest Rooms,
            //// ***
            //// Rule 3.2.1 :  2-player Contest Rooms : Scenario 2 Case 1
            ////
            if (otherPlayer.length == 1) {
                return {
                    status: true,
                    code: 0,
                    msg: "Rule 3.2.1 - Scenario 1 - 2 Player",
                    otherplayer: otherPlayer
                };
            } else {
                return {
                    status: true,
                    code: 1
                };
            }
        }
        //
        //  Wait Timer Code 0 -- Room Create and send both player
        //
        else if (maxplayer == 4) {
            otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, maxplayer: 4, isLobby: true, isJoint: false });
            if (otherPlayer.length == 3) {
                return {
                    status: true,
                    code: 0,
                    msg: "Rule 3.2.1 - Scenario 1 - 4 Player",
                    otherplayer: otherPlayer
                };
            } else {
                return {
                    status: true,
                    code: 1
                };
            }
        }
        //
        //  Wait Timer Code 0 -- Room Create and send both player
        //
        else if (maxplayer == 6) {
            otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, maxplayer: 6, isLobby: true, isJoint: false });
            if (otherPlayer.length == 5) {
                return {
                    status: true,
                    code: 0,
                    msg: "Rule 3.2.1 - Scenario 1 - 6 Player",
                    otherplayer: otherPlayer
                };
            } else {
                return {
                    status: true,
                    code: 1
                };
            }
        }
        // 
        //  Wait Timer Code 1 -- Waiting Time 
        //
        else {
            return {
                status: true,
                code: 1
            };
        }

    } catch (error) {
        //console.log("Waiting Player , " + error);
        return {
            status: false
        };
    }
}

/*
#############################################################################################
                                    LEVEL BASED MATCH MAKING
#############################################################################################
*/

// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player , 
//
// Rule 3.2.1 :  2-player Contest Rooms, 4-player Contest Rooms, 6-player Contest Rooms
// Scenario 2 Case 2 
//

async function playerLobbyForLevel(params) {
    try {
        const { levelno, point, rateno, username, maxplayer } = params;
        var currentPlayer = await Lobby.findOne({ username: username }).select({ isLobby: 1, isJoint: 1, _id: 0 }).exec();
        var otherPlayer;
        //// Rule 3.2.1 :  2-player Contest Rooms
        //// Scenario 2 Case 1 and Case 2
        ////
        if (maxplayer == 2 && currentPlayer.isJoint == false && currentPlayer.isLobby == true) {
            otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, maxplayer: 2, isLobby: true, isJoint: false });
            if (otherPlayer.length == 1) {
                return {
                    status: true,
                    code: 0,
                    msg: "Rule 3.2.1 - Scenario 1 - 2 Player",
                    otherplayer: otherPlayer
                };
            } else if (otherPlayer.length >= 2) {
                otherPlayer = _.sortBy(otherPlayer, ['userrateno', 'userlevelno'], ['asc', 'asc']);
                return {
                    status: true,
                    code: 0,
                    msg: "Rule 3.2.1 - Scenario 2 - Case 1- 2 Player",
                    otherplayer: _.take(otherPlayer, 1)
                };
            } else {
                return {
                    status: true,
                    code: 1
                };
            }
        }
        //
        //  Timer Code 0 -- Room Create and send both player
        //
        else if (maxplayer == 4 && currentPlayer.isJoint == false && currentPlayer.isLobby == true) {
            otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, maxplayer: maxplayer, isLobby: true, isJoint: false });
            if (otherPlayer.length == 3) {
                return {
                    status: true,
                    code: 0,
                    msg: "Scenario Matchmaking - 4 player",
                    otherplayer: otherPlayer
                };
            } else if (otherPlayer.length >= 4) {
                otherPlayer = _.sortBy(otherPlayer, ['userrateno', 'userlevelno'], ['asc', 'asc']);
                return {
                    status: true,
                    code: 0,
                    msg: "Scenario : Level-based Matchmaking - 4 player",
                    otherplayer: _.take(otherPlayer, 3)
                };
            } else {
                return {
                    status: true,
                    code: 1
                };
            }
        }
        //
        //  Timer Code 0 -- Room Create and send both player
        //
        else if (maxplayer == 6 && currentPlayer.isJoint == false && currentPlayer.isLobby == true) {
            otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, maxplayer: maxplayer, isLobby: true, isJoint: false });
            if (otherPlayer.length == 5) {
                return {
                    status: true,
                    code: 0,
                    msg: "Scenario Matchmaking - 6 player",
                    otherplayer: otherPlayer
                };
            } else if (otherPlayer.length >= 6) {
                otherPlayer = _.sortBy(otherPlayer, ['userrateno', 'userlevelno'], ['asc', 'asc']);
                return {
                    status: true,
                    code: 0,
                    msg: "Scenario : Level-based Matchmaking - 6 player",
                    otherplayer: _.take(otherPlayer, 5)
                };
            } else {
                return {
                    status: true,
                    code: 1
                };
            }
        }
        // 
        //  Timer Code 1 -- Waiting Time
        //
        else {
            return {
                status: true,
                code: 1
            };
        }

    } catch (error) {
        //console.log("Level Player , " + error);
        return {
            status: false
        };
    }
}


/*
#############################################################################################
                                    Create Room And Return
#############################################################################################
*/
async function createRoom(params) {
    try {
        const hashids = new Hashids(uuidv4(), 8);
        var getUserList = params.otherplayer;
        var getUserId = _.map(getUserList, 'username');
        var countRoom = await Room.countDocuments({ "userlist.username": { $in: getUserId } });
        if (countRoom == 0 && getUserList.length > 1) {
            var insertRoom = await new Room({
                roomname: hashids.encode(1, 2, 3),
                userlist: params.otherplayer
            });
            insertRoom.save();
            if (insertRoom != undefined) {
                // 
                //  Timer Code 0 -- Room Create and send both player
                //
                var sendRoom = insertRoom.userlist.length;
                if (sendRoom >= 1) {
                    for (let index = 0; index < insertRoom.userlist.length; index++) {
                        var sendSocketID = insertRoom.userlist[index].connectionid;
                        var userName = insertRoom.userlist[index].username;
                        var userPoint = insertRoom.userlist[index].point;
                        var userAdsVersionMultiplayerPlayOnline = insertRoom.userlist[index].AdsVersionMultiplayerPlayOnline;
                        // if (userAdsVersionMultiplayerPlayOnline == true) {
                        //     await User.findOneAndUpdate({ username: userName }, { $inc: { "hatsonpoints": -userPoint, "hatsonpointsplaygame": 1 } }, { "fields": { _id: 1 }, "new": true });
                        // } else {
                        //     await User.findOneAndUpdate({ username: userName }, { $inc: { "currentbalanceofpoints": -userPoint, "totalplay": 1 } }, { "fields": { _id: 1 }, "new": true });
                        // }
                        await Lobby.deleteMany({ username: userName });
                        // await Room.findOneAndUpdate({ roomname: insertRoom.roomname }, { $set: { "userlist.[].isJoint": true } });
                        // delete all document
                        _common.sendMsgToSingleUser(IO, sendSocketID, "res:createroomname", {
                            status: true,
                            msg: params.msg,
                            userlistforroom: {
                                roomname: insertRoom.roomname,
                                roomLimit: insertRoom.userlist.length
                            }
                        });
                    }
                }
                // return {
                //     status: true,
                //     code: 0
                // };
            } else {
                // 
                //  No Room Create
                //

                var countLobby = await Lobby.find({ username: { $ne: getUserId[0] }, isLobby: false }, {
                    username: 1,
                    userlevelno: 1,
                    userrateno: 1,
                    levelno: 1,
                    point: 1,
                    rateno: 1,
                    minplayer: 1,
                    maxplayer: 1,
                    isJoint: 1,
                    createdate: 1
                });
                var currentUser = await Lobby.find({ username: getUserId[0], isLobby: false });
                if (countLobby.length == 0) { }
                if (currentUser == 1) {
                    //console.log("******************************");
                    //console.log(currentUser);
                    //console.log("******************************");
                    _common.sendMsgToSingleUser(IO, currentUser[0].connectionid, "res:playerlist", {
                        status: true,
                        msg: "Other player...",
                        listofanother: countLobby
                    });
                }
            }


        } else {
            return {
                status: false,
                code: 1,
                msg: "Another Player."
            };
        }

    } catch (error) {
        //console.log("Create Room , " + error);
        return {
            status: false
        };
    }
}

/*
#############################################################################################
                                    CRITICAL TIME MATCH MAKING
#############################################################################################
*/

// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player , 
//
// Rule 3.2.1 :  2-player Contest Rooms,4-player Contest Rooms, 6-player Contest Rooms 
// Scenario 3 Case 3.1,3.2,3.3,3.4 
//
async function playerLobbyForCritical(params) {
    try {
        const { point, username, maxplayer } = params;
        var currentPlayer = await Lobby.findOne({ username: username }).select({ isLobby: 1, isJoint: 1, isSingleAlonePlayer: 1, _id: 0 });
        if (maxplayer == 2 && currentPlayer.isLobby == true && currentPlayer.isJoint == false && currentPlayer.isSingleAlonePlayer == true) {
            var currentPlayer = await Lobby.findOne({ username: username }).select({ isLobby: 1, isJoint: 1, isSingleAlonePlayer: 1, _id: 0 });
            if (currentPlayer.isLobby == true && currentPlayer.isJoint == false && currentPlayer.isSingleAlonePlayer == true && maxplayer == 2) {
                //// Case 3
                var otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 2 });
                var otherPlayerFour = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 4 });
                var otherPlayerSix = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 6 });
                var flagJoint = false;
                //// Case 3.1
                if (otherPlayer.length == 0) {
                    if (otherPlayerFour.length == 1 || otherPlayerSix.length == 1) {
                        var jointPlayer;
                        // Check 
                        if (otherPlayerFour.length == 0) {
                            jointPlayer = otherPlayerSix.length == 1 ? otherPlayerSix : otherPlayerSix;
                            return {
                                status: true,
                                code: 0,
                                msg: "Rule 3.2.1 - Scenario 2 - Case 3.1 - 2 Player",
                                otherplayer: jointPlayer // Select - 2 , 4 , 6
                            };
                        } else if (otherPlayerSix.length == 0) {
                            jointPlayer = otherPlayerFour.length == 1 ? otherPlayerSix : otherPlayerSix;
                            return {
                                status: true,
                                code: 0,
                                msg: "Rule 3.2.1 - Scenario 2 - Case 3.1 - 2 Player",
                                otherplayer: jointPlayer // Select - 2 , 4 , 6
                            };
                        } else {
                            var arrayjointPlayer = [];
                            arrayjointPlayer.push(otherPlayerSix[0]);
                            arrayjointPlayer.push(otherPlayerFour[0]);
                            jointPlayer = _.sortBy(arrayjointPlayer, ['createdate'], ['asc']);
                            return {
                                status: true,
                                code: 0,
                                msg: "Rule 3.2.1 - Scenario 2 - Case 3.1 - 2 Player",
                                otherplayer: _.take(jointPlayer, 1) // Select - 2 , 4 , 6
                            };
                        }


                    }
                    //// Case 3.2
                    // else if (otherPlayerFour.length == 1 && otherPlayerSix.length == 1) {
                    //     if (flagJoint == false) {
                    //         var jointPlayer = [];
                    //         jointPlayer.push(otherPlayerFour);
                    //         jointPlayer.push(otherPlayerSix);
                    //         otherPlayer = _.sortBy(jointPlayer, ['createdate'], ['asc']);
                    //         return {
                    //             status: true,
                    //             code: 0,
                    //             otherplayer: _.take(otherPlayer, 1)
                    //         };
                    //     }
                    // }
                    //// Case 3.3
                    else {
                        var countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price  
                        if (countLobby >= 1) {
                            return {
                                status: false,
                                code: 1,
                                msg: "Another Player."
                            };
                        } else {
                            // No Player and Change Player
                            return {
                                status: false,
                                code: 0,
                                msg: "No Player"
                            };
                        }
                    }
                } else {
                    if (otherPlayer.length == 1) {
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario 1 - 2 Player",
                            otherplayer: otherPlayer
                        };
                    } else if (otherPlayer.length >= 2) {
                        otherPlayer = _.sortBy(otherPlayer, ['userrateno', 'userlevelno'], ['asc', 'asc']);
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario 2 - Case 1- 2 Player",
                            otherplayer: _.take(otherPlayer, 1)
                        };
                    } else {
                        return {
                            status: false,
                            code: 0,
                            msg: "No Player"
                        };
                    }
                }
            }
            /// Current Player Leave Lobby
            else {
                return {
                    status: false,
                    code: 0,
                    msg: "No Player"
                };
            }
        }
        else if (maxplayer == 4 && currentPlayer.isLobby == true && currentPlayer.isJoint == false) {
            var currentPlayer = await Lobby.findOne({ username: username }).select({ isLobby: 1, isJoint: 1, isSingleAlonePlayer: 1, _id: 0 });
            if (currentPlayer.isLobby == true && currentPlayer.isJoint == false && maxplayer == 4) {
                var otherPlayerTwo = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 2 });
                var otherPlayerFour = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 4 });
                /// Rule 3.2.1 --- Case 1
                if (otherPlayerFour.length == 1) {
                    if (otherPlayerTwo.length == 1) {
                        var jointPlayer = [];
                        jointPlayer.push(otherPlayerFour[0]);
                        jointPlayer.push(otherPlayerTwo[0]);
                        jointPlayer = _.sortBy(jointPlayer, ['createdate'], ['asc']);
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 1.1,1.2 and 1.3 - 4 Player",
                            otherplayer: _.take(jointPlayer, 1)
                        };
                    } else {
                        otherPlayerFour = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 4 }).limit(3);
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 1.1,1.2 and 1.3 - 4 Player",
                            otherplayer: _.take(otherPlayerFour, otherPlayerFour.length)
                        };
                        // return {
                        //     status: true,
                        //     code: 0,
                        //     msg: "Rule 3.2.1 - Scenario - Case 1.1,1.2 and 1.3 - 4 Player",
                        //     otherplayer: otherPlayerFour
                        // };
                    }
                } else if (otherPlayerFour.length > 1 && otherPlayerFour.length <= 3) {
                    return {
                        status: true,
                        code: 0,
                        msg: "Rule 3.2.1 - Scenario - Case 2 - 4 Player",
                        otherplayer: _.take(otherPlayerFour, 3)
                    };
                } else if (otherPlayerFour.length == 0) {
                    var otherPlayerSix = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 6 }).limit(3);
                    if (otherPlayerSix.length >= 1 && otherPlayerSix.length <= 3) {
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 1 - 4 Player with 6 player",
                            otherplayer: _.take(otherPlayerSix, 3)
                        };
                    } else if (otherPlayerSix.length == 0) {
                        var otherPlayerTwo = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 2 });
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 2 - 4 Player with 2 player",
                            otherplayer: _.take(otherPlayerTwo, 1)
                        };
                    } else {
                        var countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price  
                        if (countLobby >= 1) {
                            return {
                                status: false,
                                code: 1,
                                msg: "Another Player."
                            };
                        } else {
                            // No Player and Change Player
                            return {
                                status: false,
                                code: 0,
                                msg: "No Player"
                            };
                        }
                    }
                } else {
                    var countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price  
                    if (countLobby >= 1) {
                        return {
                            status: false,
                            code: 1,
                            msg: "Another Player."
                        };
                    } else {
                        // No Player and Change Player
                        return {
                            status: false,
                            code: 0,
                            msg: "No Player"
                        };
                    }
                }
            } else {
                return {
                    status: false,
                    code: 0,
                    msg: "No Player"
                };
            }
        } else if (maxplayer == 6 && currentPlayer.isLobby == true && currentPlayer.isJoint == false) {
            var currentPlayer = await Lobby.findOne({ username: username }).select({ isLobby: 1, isJoint: 1, isSingleAlonePlayer: 1, _id: 0 });
            if (maxplayer == 6 && currentPlayer.isLobby == true && currentPlayer.isJoint == false) {
                var otherPlayerTwo = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 2 });
                var otherPlayerSix = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 6 });
                /// Rule 3.2.1 --- Case 1
                if (otherPlayerSix.length == 1) {
                    if (otherPlayerTwo.length == 1) {
                        var jointPlayer = [];
                        jointPlayer.push(otherPlayerSix[0]);
                        jointPlayer.push(otherPlayerTwo[0]);
                        jointPlayer = _.sortBy(jointPlayer, ['createdate'], ['asc']);
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 1.1,1.2 and 1.3 - 6 Player",
                            otherplayer: _.take(jointPlayer, 1)
                        };
                    } else {
                        otherPlayerSix = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 6 }).limit(5);
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 1.1,1.2 and 1.3 - 6 Player",
                            otherplayer: _.take(otherPlayerSix, otherPlayerSix.length)
                        };
                    }
                } else if (otherPlayerSix.length > 1 && otherPlayerSix.length <= 5) {
                    otherPlayerSix = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 6 }).limit(5);
                    return {
                        status: true,
                        code: 0,
                        msg: "Rule 3.2.1 - Scenario - Case 2 - 6 Player",
                        otherplayer: _.take(otherPlayerSix, otherPlayerSix.length)
                    };
                } else if (otherPlayerSix.length == 0) {
                    var otherPlayerFour = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 4 }).limit(3);
                    if (otherPlayerFour.length >= 1 && otherPlayerFour.length <= 3) {
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 1 - 6 Player with 4 player",
                            otherplayer: _.take(otherPlayerFour, 3)
                        };
                    } else if (otherPlayerFour.length == 0) {
                        var otherPlayerTwo = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, maxplayer: 2 });
                        return {
                            status: true,
                            code: 0,
                            msg: "Rule 3.2.1 - Scenario - Case 2 - 6 Player with 2 player",
                            otherplayer: _.take(otherPlayerTwo, 1)
                        };
                    } else {
                        var countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price  
                        if (countLobby >= 1) {
                            return {
                                status: false,
                                code: 1,
                                msg: "Another Player."
                            };
                        } else {
                            // No Player and Change Player
                            return {
                                status: false,
                                code: 0,
                                msg: "No Player"
                            };
                        }
                    }
                } else {
                    var countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price  
                    if (countLobby >= 1) {
                        return {
                            status: false,
                            code: 1,
                            msg: "Another Player."
                        };
                    } else {
                        // No Player and Change Player
                        return {
                            status: false,
                            code: 0,
                            msg: "No Player"
                        };
                    }
                }
            } else {
                return {
                    status: false,
                    code: 0,
                    msg: "No Player"
                };
            }
        }
        else {
            return {
                status: false,
                code: 0,
                msg: "No Player"
            };
        }
    } catch (error) {
        //console.log("Critical Player , " + error);
        return {
            status: false
        };
    }
}


/*
#############################################################################################
                                    WAIT AFTER 55 SECONDS TIME
#############################################################################################
*/
async function isUpdateCritical(params) {
    try {
        const { username } = params;
        await Lobby.findOneAndUpdate({ username: username }, { $set: { isCritical: true } });
        return {
            status: true
        };
    } catch (error) {
        //console.log("Critical Time Player Update, " + error);
        return {
            status: false
        };
    }
}

/*
#############################################################################################
                                    WAIT ABOVE 60 SECONDS TIME
#############################################################################################
*/
async function isUpdateSingleAlonePlayer(params) {
    try {
        const { username, maxplayer, point } = params;
        // var checkSingleAlonePlayer = await Lobby.countDocuments({ maxplayer: maxplayer, point: point });
        // if (checkSingleAlonePlayer == 0)
        await Lobby.findOneAndUpdate({ username: username }, { $set: { isSingleAlonePlayer: true } });
        return {
            status: true
        };
    } catch (error) {
        //console.log("Single Alone Player Update, " + error);
        return {
            status: false
        };
    }
}

/*
#############################################################################################
                                    WAIT ABOVE 60 SECONDS TIME
#############################################################################################
*/
async function isUpdateLobby(params) {
    try {
        const { username } = params;
        await Lobby.findOneAndUpdate({ username: username }, { $set: { isLobby: false, updatedate: new Date() } });
        return {
            status: true
        };
    } catch (error) {
        //console.log("Lobby Remove Player, " + error);
        return {
            status: false
        };
    }
}


/*
#############################################################################################
                                    CRITICAL TIME AFTER 
#############################################################################################
*/
async function aferForCriticalTime(params) {
    try {
        const { currentusername, selectedusername } = params;
        var countRoomforSelectUser = await Room.countDocuments({ "userlist.username": { $in: [currentusername, selectedusername] } });
        if (countRoomforSelectUser == 0) {
            var findLobby = await Lobby.find({ username: { $in: [currentusername, selectedusername] } });
            return {
                status: true,
                code: 0,
                otherplayer: findLobby
            };
        } else {
            return {
                status: false,
                code: 1
            };
        }
    } catch (error) {
        return {
            status: false
        };
    }
}

/*
#############################################################################################
                                    IF PLAYER EXIT BEFOR ENTER IN ROOM
#############################################################################################
*/
async function playerExitLobby(params) {
    try {
        const { username } = params;
        var findPlayer = await Lobby.deleteMany({ "username": username });
        // if (findPlayer != undefined) {
        return {
            status: true
            // exitlobbyplayer: findPlayer
        };
        // } else {
        //     return {
        //         status: false
        //     };
        // }
    } catch (error) {
        return {
            status: false
        };
    }
}


// Multiplayer Win Game
async function multiplayerWinplayer(params) {
    try {
        const { username, AdsVersionMultiplayerPlayOnline, roomname, type } = params;
        var multipayerupdatePoint;
        if (AdsVersionMultiplayerPlayOnline == true) {
            const { hpoint } = params;
            multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                $inc: {
                    "hatsonpoints": hpoint,
                    "totalhatsonpoints": hpoint,
                    "hatsonpointswin": 1
                }
            }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        }
        if (AdsVersionMultiplayerPlayOnline == false) {
            const { point } = params;
            multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                $inc: {
                    "currentbalanceofpoints": point,
                    "totalwinningpoints": point,
                    "totalwin": 1
                }
            }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        }
        // var newRoomname = roomname.toString();
        // newRoomname = newRoomname.slice(1, -1);
        if (type == "VSFriend") {
            await FriendRoom.findOneAndDelete({ roomname: roomname });
        }
        if (type == "VSOnline") {
            await Room.findOneAndDelete({ roomname: roomname });
        }
        // if (point > 0) {
        //     multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
        //         $inc: {
        //             "currentbalanceofpoints": point,
        //             "totalwinningpoints": point,
        //             "totalwin": 1
        //         }
        //     }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        // }
        // if (hpoint > 0) {
        //     multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
        //         $inc: {
        //             "hatsonpoints": hpoint,
        //             "totalhatsonpoints": hpoint,
        //             "hatsonpointswin": 1
        //         }
        //     }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        // }
        if (multipayerupdatePoint != undefined) {
            return {
                status: true,
                currentbalanceofpoints: multipayerupdatePoint.currentbalanceofpoints,
                hpoint: multipayerupdatePoint.hatsonpoints
            };
        } else {
            return {
                status: false,
                msg: "Win play is not update.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// Return Coin or Point
async function returnCoinOrPoint(params) {
    try {
        const { username, point, hpoint } = params;
        var multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
            $inc: {
                "currentbalanceofpoints": point,
                "hatsonpoints": hpoint // This is for mutiplayer ads version coin
            }
        }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        if (multipayerupdatePoint != undefined) {
            return {
                status: true,
                currentbalanceofpoints: multipayerupdatePoint.currentbalanceofpoints,
                hpoint: multipayerupdatePoint.hatsonpoints
            };
        } else {
            return {
                status: false,
                msg: "Return Coin is not update.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// Ads Version Add Point -- for ads version multiplayer
async function adsVesionAddPoint(params) {
    try {
        const { username, hpoint, message } = params;
        var multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
            $inc: {
                "hatsonpoints": hpoint, // This is for mutiplayer ads version coin
                "totalhatsonpoints": hpoint
            }
        }, { new: true, "fields": { hatsonpoints: 1, _id: 0 } });
        if (multipayerupdatePoint != undefined) {
            return {
                status: true,
                message: message,
                hpoint: multipayerupdatePoint.hatsonpoints
            };
        } else {
            return {
                status: false,
                msg: "Ads Point is not update.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

// Restart Coin or Point
async function restartCoinOrPoint(params) {
    try {
        const { username, AdsVersionMultiplayerPlayOnline } = params;
        var multipayerupdatePoint;
        if (AdsVersionMultiplayerPlayOnline == true) {
            const { hpoint } = params;
            multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                $inc: {
                    "hatsonpoints": - hpoint,
                    "hatsonpointsplaygame": 1
                }
            }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        }
        if (AdsVersionMultiplayerPlayOnline == false) {
            const { point } = params;
            multipayerupdatePoint = await User.findOneAndUpdate({ username: username }, {
                $inc: {
                    "currentbalanceofpoints": - point,
                    "totalplay" : 1
                }
            }, { new: true, "fields": { "currentbalanceofpoints": 1, "hatsonpoints": 1, _id: 0 } });
        }
        if (multipayerupdatePoint != undefined) {
            return {
                status: true,
                currentbalanceofpoints: multipayerupdatePoint.currentbalanceofpoints,
                hpoint: multipayerupdatePoint.hatsonpoints
            };
        } else {
            return {
                status: false,
                msg: "Return Coin is not update.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { countLobby, countRoom, insertLobby, playerLobbyForStart, playerLobbyForLevel, playerLobbyForCritical, createRoom, aferForCriticalTime, playerExitLobby, isUpdateCritical, isUpdateSingleAlonePlayer, isUpdateLobby, multiplayerWinplayer, returnCoinOrPoint, adsVesionAddPoint, restartCoinOrPoint };





/*
#############################################################################################
                                    CRITICAL TIME MATCH MAKING
#############################################################################################
*/

// Avalible in Lobby for other player -- point, rating , level (play) -- 2 Player , 
//
// Rule 3.2.1 :  2-player Contest Rooms,4-player Contest Rooms, 6-player Contest Rooms 
// Scenario 3 Case 3.1,3.2,3.3,3.4 
//
// async function playerLobbyForCritical(params) {
//     try {
//         const { levelno, point, rateno, username, maxplayer } = params;
//         var currentPlayer = await Lobby.findOne({ username: username }).select({ isLobby: 1, isJoint: 1, isSingleAlonePlayer: 1, _id: 0 });
//         var countLobby = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true }); // 2,4,6
//         var otherPlayer;
//         if (countLobby != undefined) {
//             // 
//             //  Wait Timer Code 0 -- Room Create and send both player
//             //
//             if (countLobby.length >= 1 && maxplayer == 2 && currentPlayer.isLobby == true && currentPlayer.isJoint == false && currentPlayer.isSingleAlonePlayer == true) {
//                 otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true }).limit(2);
//                 //
//                 // case 3.2
//                 //                
//                 if (otherPlayer.length >= 2) {
//                     // otherPlayer = _.sortBy(otherPlayer, ['userrateno', 'userlevelno'], ['asc', 'asc']);
//                     // timer -- data base sorting
//                     return {
//                         status: true,
//                         code: 0,
//                         otherplayer: _.take(otherPlayer, 1)
//                     };
//                 }
//                 //
//                 // case 3.1
//                 //         
//                 else if (otherPlayer.length == 1) {
//                     return {
//                         status: true,
//                         code: 0,
//                         otherplayer: otherPlayer
//                     };
//                 }
//                 //
//                 // case 3.3 && case 3.4
//                 //         
//                 else {
//                     countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price  
//                     // await Lobby.findOneAndUpdate({ username: username, isJoint: false }, { $set: { isLobby: false } });
//                     if (countLobby >= 1) {
//                         return {
//                             status: false,
//                             code: 1,
//                             msg: "Another Player."
//                         };
//                     } else {
//                         // No Player and Change Player
//                         return {
//                             status: false,
//                             code: 0,
//                             msg: "No Player"
//                         };
//                     }

//                 }

//             }
//             //
//             //  Wait Timer Code 0 -- Room Create and send both player
//             //
//             else if (countLobby.length >= 1 && maxplayer == 4 && currentPlayer.isLobby == true && currentPlayer.isJoint == false && currentPlayer.isSingleAlonePlayer == true) {
//                 otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 2 }).limit(2);
//                 //
//                 // Rule 3.2.1 :  4-player Contest Rooms && Case 2 & Case 1 { Case 1.1  }
//                 //
//                 if (countLobby.length == 2 && otherPlayer.length == 1) {
//                     // timer -- data base sorting
//                     return {
//                         status: true,
//                         code: 0,
//                         otherplayer: _.take(otherPlayer, 1) // countLobby
//                     };

//                 } else {
//                     otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 4 }).limit(3);
//                     ////
//                     //// Rule 3.2.1 :  4-player Contest Rooms && Case 2
//                     ////
//                     if (otherPlayer.length == 3) {
//                         return {
//                             status: true,
//                             code: 0,
//                             otherplayer: _.take(otherPlayer, 3)
//                         };
//                     }
//                     //
//                     // Rule :  4-player Contest Rooms && Equal to 2 or 3 Player Connect
//                     //
//                     else {
//                         otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: { $gte: 4 } }).limit(4);
//                         if (otherPlayer.length >= 1 && otherPlayer.length <= 3) {
//                             return {
//                                 status: true,
//                                 code: 0,
//                                 otherplayer: _.take(otherPlayer, otherPlayer.length)
//                             };
//                         }
//                         //
//                         // Rule 3.2.1 :  4-player Contest Rooms && Case 1 { case 1.3 && case 1.4 }
//                         // 
//                         else {
//                             countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price 
//                             // await Lobby.findOneAndUpdate({ username: username, isJoint: false }, { $set: { isLobby: false } });
//                             if (countLobby >= 1) {
//                                 return {
//                                     status: false,
//                                     code: 1,
//                                     msg: "Another Player."
//                                 };
//                             } else {
//                                 // No Player and Change Player
//                                 return {
//                                     status: false,
//                                     code: 0,
//                                     msg: "No Player"
//                                 };
//                             }

//                         }
//                     }


//                 }
//             }
//             //
//             //  Wait Timer Code 0 -- Room Create and send both player
//             //
//             else if (countLobby.length >= 1 && maxplayer == 6 && currentPlayer.isLobby == true && currentPlayer.isJoint == false) {
//                 otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 2  }).limit(2);
//                 //
//                 // Rule 3.2.1 :  6-player Contest Rooms && Case 2 & Case 1 { Case 1.1 }
//                 //
//                 if (countLobby.length == 2 && otherPlayer.length == 1) {
//                     // timer -- data base sorting
//                     return {
//                         status: true,
//                         code: 0,
//                         otherplayer: _.take(otherPlayer, 1)
//                     };
//                 }

//                 //
//                 // Rule 3.2.1 :  6-player Contest Rooms && Case 1 { case 1.3 && case 1.4 }
//                 // 
//                 else {
//                     otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: 6 }).limit(5);
//                     if(otherPlayer.length >= 1) {
//                         return {
//                             status: true,
//                             code: 0,
//                             otherplayer: _.take(otherPlayer, otherPlayer.length)
//                         };
//                     } else {
//                         otherPlayer = await Lobby.find({ username: { $ne: username }, point: point, isLobby: true, isJoint: false, isCritical: true, maxplayer: { $gte: 4 } }).limit(4);
//                         if (otherPlayer.length >= 1 && otherPlayer.length <= 3) {
//                             // If not less than four player
//                             return {
//                                 status: true,
//                                 code: 0,
//                                 otherplayer: _.take(otherPlayer, otherPlayer.length)
//                             };
//                         } else {
//                             countLobby = await Lobby.countDocuments({ username: { $ne: username }, isJoint: false }); // 2,4,6 but differnt price 
//                             // await Lobby.findOneAndUpdate({ username: username, isJoint: false }, { $set: { isLobby: false } });
//                             if (countLobby >= 1) {
//                                 return {
//                                     status: false,
//                                     code: 1,
//                                     msg: "Another Player."
//                                 };
//                             } else {
//                                 // No Player and Change Player
//                                 return {
//                                     status: false,
//                                     code: 0,
//                                     msg: "No Player"
//                                 };
//                             }
//                         }
//                     }
//                 }
//             }
//             // 
//             //  Critical Timer Complete
//             //
//             else {
//                 // await Lobby.findOneAndUpdate({ username: username, isJoint: false }, { $set: { isLobby: false } });
//                 return {
//                     status: false,
//                     code: 1
//                 };
//             }
//         } else {
//             // 
//             //  No Player
//             //
//             return {
//                 status: false,
//                 code: 0,
//                 msg: "No Another Player."
//             };
//         }
//     } catch (error) {
//         //console.log("Critical Player , " + error);
//         return {
//             status: false
//         };
//     }
// }
