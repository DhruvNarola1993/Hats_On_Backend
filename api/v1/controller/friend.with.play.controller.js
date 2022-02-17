const friendwithplayHelper = require('../helper/friend.with.play.helper');
module.exports = async (io, socket) => {
    //console.log(socket.id);
    const createfriendRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username } = payload;
            payload.connectionid = socket.id;
            var errorMsg = await friendwithplayHelper.friendinsertroom(payload);
            if (errorMsg.status) {
                socket.join(errorMsg.roomname);
                _common.sendMsgToUser(socket, "res:createfriendroom", errorMsg);
            } else {
                _common.sendMsgToUser(socket, "res:createfriendroom", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:createfriendroom", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:createfriendroom", createfriendRoom);


    // todo add expire room code after 15 min 

    const jointfriendRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { roomname, username } = payload;
            payload.connectionid = socket.id;
            payload.createdate = new Date();
            var errorMsg = await friendwithplayHelper.friendjointroom(payload);
            if (errorMsg.status) {
                socket.join(roomname);
                _common.sendMsgToUser(socket, "res:jointfriendroom", errorMsg);
            } else {
                _common.sendMsgToUser(socket, "res:jointfriendroom", errorMsg);
                socket.leave(roomname);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:jointfriendroom", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:jointfriendroom", jointfriendRoom);

    const playFriendRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { roomname, username } = payload;
            payload.connectionid = socket.id;
            var errorMsg = await friendwithplayHelper.playfriendroom(payload);
            if (errorMsg.status) {
                _common.sendMsgToAllUser(IO, roomname, "res:startfriendroom", errorMsg);
            } else {
                _common.sendMsgToUser(socket, "res:playfriendroom", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:playfriendroom", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:playfriendroom", playFriendRoom);

    const leavefriendRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { roomname, username } = payload;
            payload.connectionid = socket.id;
            var errorMsg = await friendwithplayHelper.leavefriendroom(payload);
            if (errorMsg.status) {
                _common.sendMsgToExceptUser(socket, roomname, "res:leavefriend", errorMsg);
                _common.sendMsgToUser(socket, "res:leavefriendroom", errorMsg);
                //// Unexpected response send , any time not responsed user and any time done
                socket.leave(roomname);
            } else {
                _common.sendMsgToUser(socket, "res:leavefriendroom", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:leavefriendroom", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:leavefriendroom", leavefriendRoom);

    const leaveallRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { roomname, username } = payload;
            payload.connectionid = socket.id;
            var errorMsg = await friendwithplayHelper.deletefriendroom(payload);
            if (errorMsg.status) {
                _common.sendMsgToAllUser(IO, roomname, "res:leaveallfriend", errorMsg);
                //// Unexpected response send , any time not responsed user and any time done
                socket.leave(roomname);
            } else {
                _common.sendMsgToUser(socket, "res:leaveallfriend", errorMsg);
            }
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:leaveallfriend", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:leaveallfriend", leaveallRoom);

    const invitefriendRoom = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username, inviteusername, roomname } = payload;
            payload.connectionid = socket.id;
            await friendwithplayHelper.invitefriendroom(payload);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:invitefriendroom", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:invitefriendroom", invitefriendRoom);


    const deductedPoints = async (data) => {
        try {
            var payload = _common.receiveMsgFromUser(data);
            const { username, hpoint, point } = payload;
            payload.connectionid = socket.id;
            var getUser = await friendwithplayHelper.userdeductedPoints(payload);
            _common.sendMsgToUser(socket, "res:CoinsDeduct", getUser);
        } catch (error) {
            // Error
            _common.sendMsgToUser(socket, "res:CoinsDeduct", {
                status: false,
                msg: error
            });
        }
    };
    socket.on("req:CoinsDeduct", deductedPoints);

    return {
        createfriendRoom,
        jointfriendRoom,
        leavefriendRoom,
        leaveallRoom,
        playFriendRoom,
        invitefriendRoom,
        deductedPoints
    };
};