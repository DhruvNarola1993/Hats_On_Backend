var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var starpanelSchema = new Schema({
    profilepic: { type: String, trim: true },
    usercode: { type: String, trim: true },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Starpanel = mongoose.model('STARPANEL', starpanelSchema);
module.exports = Starpanel;