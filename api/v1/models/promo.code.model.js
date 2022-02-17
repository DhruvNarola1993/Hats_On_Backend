const mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
var promocodeSchema = new mongoose.Schema({
    promocode: {
        type: String
    },
    discount: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    },
    startdate: { type: Date, default: new Date() },
    enddate: { type: Date, default: new Date() },
    subcriptiontype: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });

//Export the model
module.exports = mongoose.model('PROMO', promocodeSchema);