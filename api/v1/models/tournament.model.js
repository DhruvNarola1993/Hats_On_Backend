var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roundSchema = new Schema({
    /// Round Entry Time 
    roundentrystartdatetime: { type: Date, default: new Date() },
    /// Round Start Time 
    roundstarttime: { type: Date, default: new Date() },
    /// Round point for play game 
    roundpoints: { type: Number, default: 0 },
    /// round is first or not
    isfirstround: { type: Boolean, default: true },
    /// round number is best way
    roundnumber: { type: Number, default: 0 },
    /// Alwase It is PENDING
    roundstatus: { type: String, enum: ['ACTIVE', 'CANCEL', 'COMPLETE'], trim: true, default: "ACTIVE" },
}, { strict: false, versionKey: false });

var tournamentSchema = new Schema({
    name: { type: String, trim: true },
    /// Touranament status is 'SPECIAL', 'STAR', 'SUPER' and Tournament 
    type: { type: String, enum: ['SPECIAL', 'STAR', 'SPEEDY', 'SUPER'], trim: true, default: "SPECIAL" },
    /// Status is default active. It changed automatic.
    status: { type: String, enum: ['ACTIVE', 'CANCEL', 'COMPLETE', 'REFUNDED'], trim: true, default: "ACTIVE" },
    /// Winner Point for first
    winnerpoint: { type: Number, default: 0 },
    /// Max Number of player 
    maxplayers: { type: Number, default: 0 },
    /// Total Number of User Register 
    registertotaluser: { type: Number, default: 0 },
    /// Status is default active. It changed automatic.
    registerstatus: { type: String, enum: ['OPEN', 'CLOSED', 'CONFIRED'], trim: true, default: "OPEN" },
    /// Tournament Entry Start Date Time - using for Tournament Register
    registeropendatetime: { type: Date },
    /// Tournament Closed Date Time - using for Tournament Register Closed
    registerclosedatetime: { type: Date },
    // Register Point Per User
    registerpointsperuser: { type: Number, default: 0 },

    speedytournamentearlypointsregister: { type: Number }, // Register Point Per User for Speedy Tournament
    starcode: { type: String, trim: true }, /// It may be null. It is used for 'STAR' and 'SPEEDY'
    numberofround: { type: Number, default: 0 }, /// Number of round

    startdatetime: { type: Date }, /// Tournament Start Date Time - using for Tournament First Round

    rounds: [roundSchema],

    winner: { type: String },
    isactive: { type: Boolean, default: true },              /// For Active , Super Tournament
    isdelete: { type: Boolean, default: false },             /// For Delete , Soft Delete Data
    isdisplay: { type: Boolean, default: true },             /// For Display , Unity Side Data Show
    isreturnpayment: { type: Boolean, default: false },             /// Payment Return or not
    createby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updateby: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var Tournament = mongoose.model('TOURNAMENT', tournamentSchema);
module.exports = Tournament;