/**
 * @deprecated Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adminwintournamentSchema = new Schema({
    username: { type: String, trim: true },
    profilepic: { type: String, trim: true },
    winamount: { type: String, trim: true },
    description: { type: String, trim: true },
    tournamenttype: { type: String, trim: true },
    sequenceno: { type: Number, default: 0 },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Adminwintournament = mongoose.model('ADMINWINTOURNAMENT', adminwintournamentSchema);
module.exports = Adminwintournament;


