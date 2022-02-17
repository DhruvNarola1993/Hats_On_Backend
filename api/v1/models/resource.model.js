var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resourceSchema = new Schema({
    path: { type: String, trim: true },
    data: {
        icon: { type: String, trim: true },
        text: { type: String, trim: true }
    },
    isview: { type: Boolean, default: true },
    isnew: { type: Boolean, default: true },
    isdelete: { type: Boolean, default: true },
    isupdate: { type: Boolean, default: true },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Resource = mongoose.model('RESOURCE', resourceSchema);
module.exports = Resource;