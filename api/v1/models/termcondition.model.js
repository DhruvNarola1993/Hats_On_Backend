var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var termconditionSchema = new Schema({
    bulletpoint: { type: String, trim: true },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Terms = mongoose.model('TERMS', termconditionSchema);
module.exports = Terms;