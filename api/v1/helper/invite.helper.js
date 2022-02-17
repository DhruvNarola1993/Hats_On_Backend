var CommonValidator = require('../common/common.validator');
const { existsFacebookFriend, existsAllFriend, sendFriend, searchFriend, acceptdeclineFriend, listPendingFriend, deleteFriendTabAll, sendRequestList } = require('../services/invite.service');

// Facebook Friend
async function isFacebookFriend(params) {
    try {
        const { username } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        if (errorSocailid.status) {
            var errorMsg = await existsFacebookFriend(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// All Friend
async function isAllFriend(params) {
    try {
        const { username } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        if (errorSocailid.status) {
            var errorMsg = await existsAllFriend(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Send Friend
async function sendRequestFriend(params) {
    try {
        const { username, sendusername } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        var errorSenduserid = await CommonValidator.notEmptyAndNull(sendusername);
        if (errorSocailid.status && errorSenduserid.status) {
            var errorMsg = await sendFriend(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
            else if (!errorSenduserid.status)
                return errorSenduserid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Search Friend
async function searchFriendAny(params) {
    try {
        const { username } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        if (errorSocailid.status) {
            var errorMsg = await searchFriend(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}


// Accept or Decline Friend
async function acceptFriendAny(params) {
    try {
        const { sendusername, username, type } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        var errorSenduserid = await CommonValidator.notEmptyAndNull(sendusername);
        var errorType = await CommonValidator.notEmptyAndNull(type);
        if (errorSocailid.status && errorSenduserid.status && errorType.status) {
            var errorMsg = await acceptdeclineFriend(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
            else if (!errorSenduserid.status)
                return errorSenduserid;
            else if (!errorType.status)
                return errorType;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Pending Friend
async function pendingFriend(params) {
    try {
        const { username } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        if (errorSocailid.status) {
            var errorMsg = await listPendingFriend(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}


// Delete Friend
async function deleteFriend(params) {
    try {
        const { username, sendusername } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username); 
        var errorUser_id = await CommonValidator.notEmptyAndNull(sendusername);
        if (errorSocailid.status && errorUser_id.status) {
            var errorMsg = await deleteFriendTabAll(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}


// Sending Friend
async function sendingFriend(params) {
    try {
        const { username } = params;
        var errorSocailid = await CommonValidator.notEmptyAndNull(username);
        if (errorSocailid.status) {
            var errorMsg = await sendRequestList(params);
            return errorMsg;
        } else {
            if (!errorSocailid.status)
                return errorSocailid;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

module.exports = { isFacebookFriend, isAllFriend, sendRequestFriend, searchFriendAny, acceptFriendAny, pendingFriend, deleteFriend, sendingFriend };