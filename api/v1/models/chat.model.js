var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var chatSchema = new Schema({
    question: { type: String, trim: true },
    answer: { type: String, trim: true },
    type: { type: String},
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Chat = mongoose.model('CHAT', chatSchema);
module.exports = Chat;