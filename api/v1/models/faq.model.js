var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var faqSchema = new Schema({
    question: { type: String, trim: true },
    answer: { type: String, trim: true },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Faq = mongoose.model('FAQ', faqSchema);
module.exports = Faq;