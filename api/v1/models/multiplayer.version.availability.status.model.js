var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multiplayerVersionAvailabilityStatusSchema = new Schema({
    name: { type: String, trim: true },
    startdate: { type: Date },
    enddate: { type: Date },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var MultiplayerVersionAvailabilityStatus = mongoose.model('MULTIPLAYERVERSIONAVAILABILITYSTATUS', multiplayerVersionAvailabilityStatusSchema);
module.exports = MultiplayerVersionAvailabilityStatus;