var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var friendroomSchema = new Schema({
    roomname: { type: String },
    userlist: [{
        connectionid: { type: String },
        username: { type: String, unique: true },
        point: {
            type: Number
        },
        minplayer: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        },
        maxplayer: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        },
        /// Default is false, whenever joint any room, it's value true
        // Joint in room ---- allow only one room
        isJoint: { type: Boolean, default: false }, 
        AdsVersionMultiplayerPlayOnline: { type: Boolean },
        createdate: { type: Date, default: new Date() }
    }
    ],
    createdate: { type: Date, expires: '15m', default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var FriendRoom = mongoose.model('FRIENDROOM', friendroomSchema);
module.exports = FriendRoom;