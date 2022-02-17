const inviteHelper = require('../helper/invite.helper');

module.exports = async (io, socket) => {
    //console.log(socket.id);
    // Facebook Get
    const listfacebookFriend = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.isFacebookFriend(payload);
            _common.sendMsgToUser(socket, "res:facebookfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:facebookfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:facebookfriend", listfacebookFriend);


    // All Friends
    const listallFriend = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.isAllFriend(payload);
            _common.sendMsgToUser(socket, "res:allfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:allfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:allfriend", listallFriend);


    // Send Friend Request
    const sendFriendRequest = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.sendRequestFriend(payload);
            _common.sendMsgToUser(socket, "res:sendfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:sendfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:sendfriend", sendFriendRequest);


    // Search Friend
    const searchFriendRequest = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.searchFriendAny(payload);
            _common.sendMsgToUser(socket, "res:searchfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:searchfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:searchfriend", searchFriendRequest);


    // Accept Friend
    const acceptFriendRequest = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.acceptFriendAny(payload);
            _common.sendMsgToUser(socket, "res:acceptfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:acceptfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:acceptfriend", acceptFriendRequest);


    // Pending Friend List
    const pendingFriendRequest = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.pendingFriend(payload);
            _common.sendMsgToUser(socket, "res:pendingfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:pendingfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:pendingfriend", pendingFriendRequest);


    // Delete Friend 
    const deleteFriendRequest = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.deleteFriend(payload);
            _common.sendMsgToUser(socket, "res:deletefriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:deletefriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:deletefriend", deleteFriendRequest);

     // Own Sending List
     const listSendingFriend = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload; // socialid as userid
            var errorMsg = await inviteHelper.sendingFriend(payload);
            _common.sendMsgToUser(socket, "res:sendingfriend", errorMsg);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:sendingfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:sendingfriend", listSendingFriend);

    return {
        listfacebookFriend,
        listallFriend,
        sendFriendRequest,
        searchFriendRequest,
        acceptFriendRequest,
        pendingFriendRequest,
        deleteFriendRequest,
        listSendingFriend
    };
};