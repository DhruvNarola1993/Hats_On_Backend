var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var computercoinSchema = new Schema({
    coins: {
        type: Number
    },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Computercoin = mongoose.model('COMPUTERCOIN', computercoinSchema);
module.exports = Computercoin;