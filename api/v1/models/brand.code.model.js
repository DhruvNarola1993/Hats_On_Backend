const mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
var brandcodeSchema = new mongoose.Schema({
    brandcode: {
        type: String
    },
    startdate: { type: Date, default: new Date() },
    enddate: { type: Date, default: new Date() },
    brandType: { type: String }, /// Example of brand-type - POINT, SUBCRIPTION
    pointbasedType : { type: Number },
    subcriptiontype: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });

//Export the model
module.exports = mongoose.model('BRAND', brandcodeSchema);