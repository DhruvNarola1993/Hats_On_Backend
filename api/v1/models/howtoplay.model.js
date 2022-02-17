var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var howtoplaySchema = new Schema({
    bulletpoint: { type: String, trim: true },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var How_Play = mongoose.model('HOWTOPLAY', howtoplaySchema);
module.exports = How_Play;