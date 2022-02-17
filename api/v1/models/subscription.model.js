var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var subscriptionSchema = new Schema({
    name: { type: String, trim: true },
    fees: { type: Number },
    feesandcharges: { type: Number }, /// Date - 24-09-2021 by Abhineet
    starreferralpercentage: { type: Number }, // Star Referral Benefit
    standardreferralpoints: { type: Number }, // Only For Standard Referral Benefit 
    isactive: {type: Boolean, default: true},
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Subscription = mongoose.model('SUBSCRIPTION', subscriptionSchema);
module.exports = Subscription;