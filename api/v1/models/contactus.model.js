var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var contactSchema = new Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    mobile: { type: String, trim: true },
    query: { type: String, trim: true },
    answer: { type: String, trim: true, default: "" },
    createdate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false  });
var Contact = mongoose.model('CONTACTUS', contactSchema);
module.exports = Contact;