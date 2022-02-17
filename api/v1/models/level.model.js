var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var levelSchema = new Schema({
    levelno: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    },
    name: { type: String, trim: true },
    winlevel: {
        type: Number, 
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    }, // 100, 150
    point: { type: Number }, // 2.5, 5, 10, 25, 50, 100, 250, 500, 750, 1000, 1500.
    ratingid: { type: Schema.Types.ObjectId, ref: 'Rating' },
    movelevelid: { type: Schema.Types.ObjectId, ref: 'Level', default: null }, // Note 1 -> Move to new level more than winlevel
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Level = mongoose.model('LEVEL', levelSchema);
module.exports = Level;