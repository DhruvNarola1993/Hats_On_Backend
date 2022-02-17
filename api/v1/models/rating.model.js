var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ratingSchema = new Schema({
    rateno: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    },
    name: { type: String, trim: true },
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
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Rating = mongoose.model('RATING', ratingSchema);
module.exports = Rating;

// Note 1 :  A player is on Beginner Level 11. If after that he wins 100 games of Rs. 25 in 6-player contests, he gets moved directly to Advanced Level 4.
// Note 2 :   A brand new player has no level. If he wins 100 games of Rs. 1500 in 6-player contests, he gets moved directly to Advanced Level 11.