var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multiplayerAdsVersionStatusSchema = new Schema({
    name: { type: String, trim: true },
    startdate: { type: Date },
    enddate: { type: Date },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var MultiplayerAdsVersionStatus = mongoose.model('MULTIPLAYERADSVERSIONSTATUS', multiplayerAdsVersionStatusSchema);
module.exports = MultiplayerAdsVersionStatus;