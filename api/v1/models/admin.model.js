var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminSchema = new Schema({
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Admin = mongoose.model('ADMIN', adminSchema);
module.exports = Admin;