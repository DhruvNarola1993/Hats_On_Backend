var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = new Schema({
    roomname: { type: String },
    userlist: [{
        connectionid: { type: String },
        username: { type: String, unique: true },
        // userlevelid: { type: Schema.Types.ObjectId, ref: 'Level' },
        // userratingid: { type: Schema.Types.ObjectId, ref: 'Rating' },
        userlevelno: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        },
        userrateno: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        },
        levelid: { type: Schema.Types.ObjectId, ref: 'Level' },
        ratingid: { type: Schema.Types.ObjectId, ref: 'Rating' },
        winlevel: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        },
        levelno: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        },
        point: {
            type: Number
        },
        movelevelid: { type: String, ref: 'Level' },
        rateno: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
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
        isJoint: { type: Boolean, default: false }, // Joint in room ---- allow only one room
        /// Default is true, whenever joint not any room, it's value false
        isLobby: { type: Boolean, default: true }, // Lobby --- Time is over - above 61 seconds
        /// Default is false, whenever time is up 55 - 59, it's value true
        isCritical: { type: Boolean, default: false }, // Critical in room - between 55-60 seconds
        /// Default is false, whenever time is up 59, it's value true
        isSingleAlonePlayer: { type: Boolean, default: false }, // in lobby

        createdate: { type: Date, default: new Date() }
    }  // { type: Schema.Types.Mixed, ref: 'Lobby' }
    ],
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Room = mongoose.model('ROOM', roomSchema);
module.exports = Room;