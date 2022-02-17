const mongoose = require('mongoose'); // Erase if already required
var Schema = mongoose.Schema;
// Declare the Schema of the Mongo model
var hordingSchema = new mongoose.Schema({
    name: { type: String },
    hording: {
        type: String,
        required: true,
        index: true,
    },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });

//Export the model
module.exports = mongoose.model('Hording', hordingSchema);