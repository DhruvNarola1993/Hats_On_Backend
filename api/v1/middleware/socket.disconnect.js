var Lobby = require("../models/lobby.model");
var Room = require("../models/room.model");
var PlayWithFriendRoom = require("../models/friend.room.model");
var User = require("../models/user.model");
var TournamentUser = require("../models/tournamentuser.model");
var _ = require('lodash');
module.exports = async (io, socket, type) => {

    socket.on('disconnecting', () => {
        // //console.log(socket.rooms); // the Set contains at least the socket ID
    });

    socket.on("disconnect", async () => {
        // 
        // //console.log(type);
        // if (type == "ftp")
        //console.log("Dis-- " , socket.id)
        var socketId = socket.id;
        var tournamentUser = await TournamentUser.findOneAndUpdate({ connectionid: socketId }, { $set: { connectionid: '' } }, { new: true });
        if (tournamentUser != undefined) {
            var isPlay = tournamentUser.diduserplaygame;
            if (isPlay) {

            }
        }
        await User.findOneAndUpdate({ connectionid: socketId }, { $set: { connectionid: '', online: false } }, { "fields": { _id: 1 } });
        await Lobby.findOneAndDelete({ connectionid: socketId });
        // await Room.findOneAndUpdate({ "userlist.connectionid": socketId }, { "$pull": { "userlist": { "connectionid": socketId } } });
        var getFriendRoom = await PlayWithFriendRoom.findOne({ "userlist.connectionid": socketId });
        // //console.log("Disconnect ======== ", getFriendRoom);
        if (getFriendRoom != undefined) {
            var friendRoomname = getFriendRoom.roomname;
            var getListUser = getFriendRoom.userlist;
            var arrayUserIds = _.map(getListUser, 'isJoint');
            var isReadyFound = _.includes(arrayUserIds, false);
            // //console.log("Disconnect ======== ", arrayUserIds, isReadyFound);
            if (isReadyFound) {
                var findUsername = getListUser.filter(data => data.connectionid == socketId)[0];
                var mainUsername = getListUser[0].username;
                var currentUsername = findUsername.username;
                // res:leaveallfriend
                if (mainUsername == currentUsername) {
                    await PlayWithFriendRoom.findOneAndDelete({ "roomname": friendRoomname });
                    _common.sendMsgToAllUser(IO, friendRoomname, "res:leaveallfriend", { status: true });
                } else {
                    await PlayWithFriendRoom.findOneAndUpdate({ roomname: friendRoomname, "userlist.username": currentUsername }, { "$pull": { "userlist": { "username": currentUsername } } });
                    _common.sendMsgToAllUser(IO, friendRoomname, "res:leavefriend", { status: true, leaveFriendUserName: currentUsername });
                }

            }
        }
    });

};