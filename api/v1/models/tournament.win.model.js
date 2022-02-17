var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tournametWinnerSchema = new Schema({
    winnerphoto: { type: String, trim: true },
    description: { type: String, trim: true },
    userid: { type: String, trim: true },
    winnerpoint: { type: String, trim: true },
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var TournametWinner = mongoose.model('TOURNAMENTWINER', tournametWinnerSchema);
module.exports = TournametWinner;
