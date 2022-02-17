var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var roleSchema = new Schema({
    name: { type: String, trim: true },
    resourcelist: [{ type: Schema.Types.Mixed, ref: 'Resource' }],
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Role = mongoose.model('ROLE', roleSchema);
module.exports = Role;