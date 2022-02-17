var CommonValidator = require('../common/common.validator');
const { createFriendRoomOrNot, jointFriendRoomOrNot, leaveFriendRoomOrNot, deleteFriendRoomOrNot, playFriendRoomOrNot, inviteFriendRoom, userdeductedPointsService } = require('../services/friend.with.play.service');
// insert
async function friendinsertroom(params) {
    try {
        const { username, point } = params;
        var errorColor = await CommonValidator.notEmptyAndNull(username);
        var errorEntrypoint = await CommonValidator.isNumber(point);
        if (errorColor.status && errorEntrypoint.status) {
            var errorMsg = await createFriendRoomOrNot(params);
            return errorMsg;
        } else {
            if (!errorColor.status)
                return errorColor;
            else if (!errorEntrypoint.status)
                return errorEntrypoint;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// joint
async function friendjointroom(params) {
    try {
        const { roomname, username } = params;
        var errorRoomname = await CommonValidator.notEmptyAndNull(roomname);
        var errorColor = await CommonValidator.notEmptyAndNull(username);
        if (errorRoomname.status && errorColor.status) {
            var errorMsg = await jointFriendRoomOrNot(params);
            return errorMsg;
        } else {
            if (!errorRoomname.status)
                return errorRoomname;
            else if (!errorColor.status)
                return errorColor;

        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// play wih friend in room
async function playfriendroom(params) {
    try {
        const { roomname, username } = params;
        var errorRoomname = await CommonValidator.notEmptyAndNull(roomname);
        var errorUserid = await CommonValidator.notEmptyAndNull(username);
        if (errorRoomname.status && errorUserid.status) {
            var errorMsg = await playFriendRoomOrNot(params);
            return errorMsg;
        } else {
            if (!errorRoomname.status)
                return errorRoomname;
            else if (!errorUserid.status)
                return errorUserid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// leave room player
async function leavefriendroom(params) {
    try {
        const { roomname, username } = params;
        var errorRoomname = await CommonValidator.notEmptyAndNull(roomname);
        var errorUserid = await CommonValidator.notEmptyAndNull(username);
        if (errorRoomname.status && errorUserid.status) {
            var errorMsg = await leaveFriendRoomOrNot(params);
            return errorMsg;
        } else {
            if (!errorRoomname.status)
                return errorRoomname;
            else if (!errorUserid.status)
                return errorUserid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// delete friend room player
async function deletefriendroom(params) {
    try {
        const { roomname, username } = params;
        var errorRoomname = await CommonValidator.notEmptyAndNull(roomname);
        var errorUserid = await CommonValidator.notEmptyAndNull(username);
        if (errorRoomname.status && errorUserid.status) {
            var errorMsg = await deleteFriendRoomOrNot(params);
            return errorMsg;
        } else {
            if (!errorRoomname.status)
                return errorRoomname;
            else if (!errorUserid.status)
                return errorUserid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Invite Friend
async function invitefriendroom(params) {
    try {
        const { username, inviteusername, roomname } = params;
        var errorRoomname = await CommonValidator.notEmptyAndNull(roomname);
        var errorInviteUsername = await CommonValidator.notEmptyAndNull(inviteusername);
        var errorUsername = await CommonValidator.notEmptyAndNull(username);
        if (errorRoomname.status && errorUsername.status && errorInviteUsername.status) {
            var errorMsg = await inviteFriendRoom(params);
            return errorMsg;
        } else {
            if (!errorRoomname.status)
                return errorRoomname;
            else if (!errorUsername.status)
                return errorUsername;
            else if (!errorInviteUsername.status)
                return errorInviteUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}


// Deduct Coin
async function userdeductedPoints(params) {
    try {
        const { username, hpoint, point } = params;
        var errorRoomname = await CommonValidator.notEmptyAndNull(username);
        var errorInviteUsername = await CommonValidator.isNumber(hpoint);
        var errorUsername = await CommonValidator.isNumber(point);
        if (errorRoomname.status && errorUsername.status && errorInviteUsername.status) {
            var errorMsg = await userdeductedPointsService(params);
            return errorMsg;
        } else {
            if (!errorRoomname.status)
                return errorRoomname;
            else if (!errorUsername.status)
                return errorUsername;
            else if (!errorInviteUsername.status)
                return errorInviteUsername;
        }
    } catch (error) {
        //console.log(error)
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

module.exports = { friendinsertroom, friendjointroom, leavefriendroom, deletefriendroom, playfriendroom, invitefriendroom, userdeductedPoints };