var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tournamentuserSchema = new Schema({
    username: { type: String, trim: true },
    /// Game type
    type: { type: String, trim: true },
    /// Tournament ID's
    tournamentid: { type: Schema.Types.ObjectId, ref: 'Tournament' },
    /// Tournament Type for 'SPECIAL', 'STAR', 'SUPER' 
    /// It have been changed to admin for SPEEDY 
    fullyconfirmedtournamentuser: { type: Boolean, default: false },
    /// It is less than always tournament register end date.
    /// It have been changed to admin for SPEEDY 
    fullregistrationdate: { type: Date, default: new Date() },
    /// Tournament Type for SPEEDY
    earlyconfirmedspeedytournamentuser: { type: Boolean, default: true },
    /// It is less than always tournament register end date.
    earlyregistrationdate: { type: Date, default: new Date() },
    // ***************************************************************
    ///                         Round
    // ***************************************************************
    /// Tournament Type for 'SPECIAL', 'STAR', 'SUPER' with true value
    /// Tournament Type for 'SPEEDY' with false value
    /// User won round true
    /// If user not play round , check tournament time and check user nextround with value
    isusereligible: { type: Boolean, default: true },
    /// User can play round than its value is true 
    /// User can be disconnected than its value is true . 
    /// NOTE: necessity User starts the game than its value is true otherwise its value is false.
    diduserplaygame: { type: Boolean, default: false },
    /// user win current round and last play round
    diduserwin: { type: Boolean, default: false },
    /// User current round , User pervious round than user play round increment 
    previousround: { type: Number, default: 0 },
    /// User next round  , User win than its value is increment
    nextround: { type: Number, default: 1 },

    /// User Connect and Play User
    connectionid: { type: String, default: "" },


    adsversionmultiplayerplayonline: { type: Boolean },
    isdelete: { type: Boolean, default: false },   // IsDelete not seen User in Unity Side , it is equal to isdisplay
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Tournamentuser = mongoose.model('TOURNAMENTUSER', tournamentuserSchema);
module.exports = Tournamentuser;