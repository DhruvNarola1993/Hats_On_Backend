var User = require('../models/user.model');
_ = require("lodash");
// Exists Facebook Friend
async function existsFacebookFriend(params) {
    try {
        const { username } = params;
        var getUser = await User.findOne({ "username": username }, { "friendfacebook": 1, _id: 0 });
        if (getUser != undefined) {
            var arrayFriend = getUser.friendfacebook == 0 ? [] : getUser.friendfacebook;
            //console.log(arrayFriend);
            var friendList = await User.find({ username: { $in: arrayFriend } }, { username: 1, name: 1 });
            return {
                status: true,
                facebookfriend: friendList
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

// Exists All Friend
async function existsAllFriend(params) {
    try {
        const { username } = params;
        var getUser = await User.findOne({ "username": username }, { "friendaccept": 1, _id: 0 });
        if (getUser != undefined) {
            var arrayFriend = getUser.friendaccept == 0 ? [] : getUser.friendaccept;
            var friendList = await User.find({ username: { $in: arrayFriend } }, { username: 1, name: 1 });
            return {
                status: true,
                allfriend: friendList
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


// Send Request
async function sendFriend(params) {
    try {
        const { username, sendusername, type } = params; // 
        var getUser;
        if (type == "SEND") {
            getUser = await User.findOneAndUpdate({ "username": sendusername }, { $addToSet: { "friendpending": username } }, { "fields": { friendpending: 1, _id: 0 }, new: true });
            return {
                status: true,
                msg: "Successfully send friend request.",
                type: type,
                sendusername: sendusername
            };
        } else if (type == "CANCEL") {
            getUser = await User.findOneAndUpdate({ "username": sendusername }, { $pull: { "friendpending": username } }, { "fields": { friendpending: 1, _id: 0 }, new: true });
            return {
                status: true,
                msg: "Successfully cancel friend request.",
                type: type,
                sendusername: sendusername
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

// Search Friend
async function searchFriend(params) {
    try {
        const { username, searchusername } = params;
        var getUserFriend = await User.findOne({ "username": username }, { "friendaccept": 1, "friendpending": 1, _id: 0 });
        var friendAcceptList = getUserFriend.friendaccept;
        var friendPendingList = getUserFriend.friendpending;
        var getUser = await User.find({ $and: [{ "username": searchusername }, { "username": { $ne: username } }] }).select({ username: 1, name: 1 }); //{ "$regex": username, "$options": 'i' }
        var arrayUser = [];
        if (getUser.length > 0) {
            for (let index = 0; index < getUser.length; index++) {
                var object = {};
                object.username = getUser[index].username;
                object.name = getUser[index].name;
                object.isFriend = false;
                object.isrequestsend = false;
                if (friendAcceptList.length > 0) {
                    for (let innerIndex = 0; innerIndex < friendAcceptList.length; innerIndex++) {
                        if (getUser[index].username.toString() == friendAcceptList[innerIndex].toString()) {
                            object.isFriend = true;
                            break;
                        }
                    }
                }
                if (friendPendingList.length > 0 && object.isFriend == false) {
                    for (let innerIndex = 0; innerIndex < friendPendingList.length; innerIndex++) {
                        if (getUser[index].username.toString() == friendPendingList[innerIndex].toString()) {
                            object.isrequestsend = true;
                            break;
                        }
                    }
                }
                arrayUser.push(object);
            }
        }
        if (arrayUser != undefined) {
            return {
                status: true,
                searchfriendlist: arrayUser
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


// Accept or Decline Friend
async function acceptdeclineFriend(params) {
    try {
        const { username, sendusername, type } = params;
        var updateUserPendingList; // = await User.findOneAndUpdate({ "userid": userid }, { $pull: { friendpending: senduser_id } }, { "fields": { friendpending: 1, _id: 0 }, new: true });
        var updateUserAcceptList;
        if (type == "ACCEPT") {
            updateUserPendingList = await User.findOneAndUpdate({ "username": username }, { $pull: { friendpending: sendusername }, $addToSet: { friendaccept: sendusername } }, { "fields": { _id: 1 }, new: true });
            updateUserAcceptList = await User.findOneAndUpdate({ "username": sendusername }, { $addToSet: { friendaccept: username } }, { "fields": { _id: 1 }, new: true });
        } else if (type == "DECLINE") {
            updateUserPendingList = await User.findOneAndUpdate({ "username": username }, { $pull: { friendpending: sendusername } }, { "fields": { _id: 1 }, new: true });
        }
        if (updateUserPendingList != undefined) {
            return {
                status: true,
                username: username,
                sendusername: sendusername
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


// Pending Friend
async function listPendingFriend(params) {
    try {
        const { username } = params;
        var userPending = await User.findOne({ "username": username }).select({ friendpending: 1 });
        if (userPending != undefined) {
            var userPendingList = await User.find({ username: { $in: userPending.friendpending } }, { name: 1, username: 1 });
            return {
                status: true,
                listpendingfriend: userPendingList
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


// Delete Friend
async function deleteFriendTabAll(params) {
    try {
        const { username, sendusername } = params;
        var updateUserPendingList = await User.findOneAndUpdate({ "username": username }, { $pull: { friendaccept: sendusername } }, { "fields": { friendaccept: 1, _id: 0 }, new: true });
        await User.findOneAndUpdate({ "username": sendusername }, { $pull: { friendaccept: username } }, { "fields": { friendaccept: 1, _id: 0 }, new: true });
        if (updateUserPendingList != undefined) {
            return {
                status: true,
                deletefriend: sendusername
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

// Send Request List
async function sendRequestList(params) {
    try {
        const { username } = params;
        var userSendingList = await User.find({ friendpending: username }, { username: 1, name: 1 });
        var arrayUser = [];
        if (userSendingList.length > 0) {
            for (let index = 0; index < userSendingList.length; index++) {
                var object = {};
                object.username = userSendingList[index].username;
                object.name = userSendingList[index].name;
                object.isFriend = false;
                object.isrequestsend = true;
                arrayUser.push(object);
            }
        }
        if (arrayUser != undefined) {
            return {
                status: true,
                listsendingfriend: arrayUser
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

module.exports = { existsFacebookFriend, existsAllFriend, sendFriend, searchFriend, acceptdeclineFriend, listPendingFriend, deleteFriendTabAll, sendRequestList };