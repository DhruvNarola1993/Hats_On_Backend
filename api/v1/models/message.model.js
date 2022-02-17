var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    key: { type: String }, // Unique key
    uniquecode: { type: Number, unique: true },
    message: { type: String },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Message = mongoose.model('MESSAGE', messageSchema);
module.exports = Message;