var Room = require('../models/friend.room.model');
var UniqueRoom = require('../common/room.unique');
var _ = require("lodash");
const User = require('../models/user.model');
var moment = require("moment");

// Insert After Waiting Player in room --- createFriendRoomOrNot
async function createFriendRoomOrNot(params) {
    try {
        const { username, point, AdsVersionMultiplayerPlayOnline, maxplayer } = params;
        var getUserdata = await User.findOne({ username: username }).select({ hatsonpoints: 1, currentbalanceofpoints: 1 });
        if (getUserdata != undefined) {
            var getUserCoin = 0;
            if (AdsVersionMultiplayerPlayOnline == true) {
                getUserCoin = getUserdata.hatsonpoints;
            } else {
                getUserCoin = getUserdata.currentbalanceofpoints;
            }
            //console.log(getUserCoin);
            if (getUserCoin >= (getUserCoin - point) && (getUserCoin - point) >= 0) {
                await Room.deleteMany({ "userlist.username": username });
                var createdRoom = await UniqueRoom.uniquehashid(username);
                var arrayList = [];
                arrayList.push(params);
                if (createdRoom.status) {
                    var insertdRoom = await new Room({
                        roomname: createdRoom.createHash,
                        userlist: arrayList,
                        createdate: new Date()
                    });
                    var getInsertRoom = await insertdRoom.save();
                    if (getInsertRoom != undefined) {
                        return {
                            status: true,
                            roomname: insertdRoom.roomname,
                            roomLimit: maxplayer
                        };
                    } else {
                        return {
                            status: false,
                            msg: "Room could not be created. Please try again."
                        };
                    }

                } else {
                    return {
                        status: false,
                        msg: "Room could not be created. Please try again."
                    };
                }
            } else {
                return {
                    status: false,
                    msg: `You have points ${getUserCoin}. \n You need points ${point} to play. \n Please go to Add Points.`
                };
            }

        } else {
            return {
                status: false,
                msg: "User could not be found."
            };
        }

    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Joint Room -- Joint Room
async function jointFriendRoomOrNot(params) {
    try {
        const { roomname, username, AdsVersionMultiplayerPlayOnline, avatarIndex, connectionid } = params;
        /// Check Balance Play the game.
        /// If balance is sufficent , it is all right.
        /// When balance is unsufficent
        var getDataInRoom = await Room.findOne({ roomname: roomname }).select({ userlist: 1, createdate: 1 });
        if (getDataInRoom != undefined) {
            var getListUser = getDataInRoom.userlist;
            var arrayUserIds = _.map(getListUser, 'isJoint');
            var isReadyFound = _.includes(arrayUserIds, false);
            var getMaxplayer = getListUser[0].maxplayer;
            var getEntrypoint = getListUser[0].point;
            // var dateofvisit = moment(getDataInRoom.createdate);
            // var today = moment();
            // var difference = today.diff(dateofvisit, 'second');
            // //console.log(difference)
            if (isReadyFound) {
                if (getListUser.length < getMaxplayer) {
                    var getUserdata = await User.findOne({ username: username }).select({ hatsonpoints: 1, currentbalanceofpoints: 1 });
                    if (getUserdata != undefined) {
                        var getUserCoin = 0;
                        if (AdsVersionMultiplayerPlayOnline == true) {
                            getUserCoin = getUserdata.hatsonpoints;
                        } else {
                            getUserCoin = getUserdata.currentbalanceofpoints;
                        }
                        if (getUserCoin >= (getUserCoin - getEntrypoint) && (getUserCoin - getEntrypoint) >= 0) {
                            var adduser = {
                                username: username, avatarIndex: avatarIndex, point: getEntrypoint, AdsVersionMultiplayerPlayOnline: AdsVersionMultiplayerPlayOnline
                            };
                            //// balance minus when user play
                            // if (AdsVersionMultiplayerPlayOnline == true) {
                            //     await User.findOneAndUpdate({ username: username }, { $inc: { "hatsonpoints": -getEntrypoint, "hatsonpointsplaygame": 1 } }, { "fields": { _id: 1 }, "new": true });
                            // } else {
                            //     await User.findOneAndUpdate({ username: username }, { $inc: { "currentbalanceofpoints": -getEntrypoint, "totalplay": 1 } }, { "fields": { _id: 1 }, "new": true });
                            // }
                            var findRoom = await Room.findOneAndUpdate({ roomname: roomname }, {
                                $addToSet: {
                                    userlist: {
                                        username: username, isJoint: false, avatarIndex: avatarIndex, connectionid: connectionid,
                                        AdsVersionMultiplayerPlayOnline: AdsVersionMultiplayerPlayOnline, point: getEntrypoint,
                                    }
                                }
                            });
                            if (findRoom != undefined) {
                                _common.sendMsgToAllUser(IO, roomname, "res:jointNewFriendRoom", {
                                    status: true,
                                    newUser: adduser, // New Player
                                    maxplayer: getMaxplayer
                                });

                                return {
                                    status: true,
                                    roomList: findRoom.userlist, // Old Player
                                    maxplayer: getMaxplayer
                                };
                            } else {
                                /// Play 
                                return {
                                    status: false,
                                    msg: `Room could not be joined. Please try again.`
                                };
                            }
                        } else {
                            return {
                                status: false,
                                msg: `You have points ${getUserCoin}. \n You need points ${getEntrypoint} to play. \n Please go to Add Points.`
                                // msg: `User have point ${getUserCoin} and Room have minimum ${getEntrypoint} coin so, User has an insuficient coin.`
                            };
                        }
                    } else {
                        return {
                            status: false,
                            msg: "User could not be found."
                        };
                    }
                } else {
                    return {
                        status: false,
                        msg: "Room is full. Please Try Again."
                    };
                }
            } else {
                /// TODO : 15 minute
                return {
                    status: false,
                    msg: "This Room Code has expired." 
                };
            }
        } else {
            
            return {
                status: false,
                msg: "Invalid Room Code." 
            };
        }


    } catch (error) {
        //console.log(error);
        return {
            status: false,
            msg: error
        };
    }
}

// Play Friend all ready
async function playFriendRoomOrNot(params) {
    try {
        const { roomname, username, roomlimit } = params;
        var findRoom = await Room.findOneAndUpdate({ roomname: roomname, "userlist.username": username },
            { $set: { "userlist.$[].isJoint": true } }, { "fields": { userlist: 1, _id: 0 }, new: true });
        if (findRoom != undefined) {
            var getListUser = findRoom.userlist;
            if (getListUser.length >= 2 && 6 >= getListUser.length) {
                if (getListUser.length > 0) {
                    for (let index = 0; index < getListUser.length; index++) {
                        const userName = getListUser[index].username;
                        const userPoint = getListUser[index].point;
                        const userAdsVersionMultiplayerPlayOnline = getListUser[index].AdsVersionMultiplayerPlayOnline;
                        //// balance minus when user play
                        if (userAdsVersionMultiplayerPlayOnline == true) {
                            // "hatsonpoints": -userPoint, 
                            await User.findOneAndUpdate({ username: userName }, { $inc: { "hatsonpointsplaygame": 1 } }, { "fields": { _id: 1 }, "new": true });
                        } else {
                            // "currentbalanceofpoints": -userPoint,
                            await User.findOneAndUpdate({ username: userName }, { $inc: { "totalplay": 1 } }, { "fields": { _id: 1 }, "new": true });
                        }

                    }
                }
                return {
                    status: true,
                    // roomUser: findRoom.userlist,
                    roomlimit: roomlimit
                };
            } else {
                return {
                    status: false,
                    msg: "Player is less than two."
                };
            }

        } else {
            return {
                status: false,
                msg: "Player is not ready for play."
            };
        }
    } catch (error) {
        //console.log(error);
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }
}

// Player is Leave in Room
async function leaveFriendRoomOrNot(params) {
    try {
        const { roomname, username } = params;
        var findRoom = await Room.findOneAndUpdate({ roomname: roomname, "userlist.username": username }, { "$pull": { "userlist": { "username": username } } });
        if (findRoom != undefined) {
            // Send All Other User And Own sockect
            return {
                status: true,
                leaveFriendUserName: username
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

// Main Player is exit Room - Room Delete
async function deleteFriendRoomOrNot(params) {
    try {
        const { roomname, username, AdsVersionMultiplayerPlayOnline } = params;
        var findRoom = await Room.findOneAndDelete({ roomname: roomname, "userlist.username": username });
        if (findRoom != undefined) {
            return {
                status: true
            };
        } else {
            return {
                status: true,
                msg: "Room is not avalible."
            };
        }

    } catch (error) {
        //console.log(error);
        return {
            status: false,
            msg: error
        };
    }
}

async function inviteFriendRoom(params) {
    try {
        const { username, inviteusername, roomname, maxplayer, point } = params;
        var findRoom = await Room.findOneAndUpdate({ roomname: roomname });
        var findUsername = await User.findOne({ username: inviteusername }, { connectionid: 1 });
        //console.log(findRoom, findUsername);
        if (findRoom != undefined && findUsername != undefined) {
            _common.sendMsgToSingleUser(IO, findUsername.connectionid, "res:invitefriendroom", {
                status: true,
                inviteFriend: {
                    username: username,
                    inviteusername: inviteusername,
                    roomname: roomname,
                    maxplayer: maxplayer,
                    point: point
                }
            });
            return {
                status: true
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

/// Deducute Coin and Update
async function userdeductedPointsService(params) {
    try {
        const { username, hpoint, point } = params;
        var findUsername = await User.findOneAndUpdate({ username: username }, {
            $inc: {
                hatsonpoints: - (hpoint),
                currentbalanceofpoints: - point
            }
        }, { "new": true, "fields": { hatsonpoints: 1, currentbalanceofpoints: 1 } });

        if (findUsername != undefined) {
            return {
                status: true,
                updatePoints:findUsername
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

module.exports = { createFriendRoomOrNot, jointFriendRoomOrNot, playFriendRoomOrNot, leaveFriendRoomOrNot, deleteFriendRoomOrNot, inviteFriendRoom, userdeductedPointsService };