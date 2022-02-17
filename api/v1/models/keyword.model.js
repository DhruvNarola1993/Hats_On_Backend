var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var keywordSchema = new Schema({
    key: { type: String, trim: true },
    value: { type: Schema.Types.Mixed }, // Ex. Time
    type: { type: Boolean, default: true }, // Here, Server (true) , Unity (false) 
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Keyword = mongoose.model('KEYWORD', keywordSchema);
module.exports = Keyword;