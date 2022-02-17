var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
const Hashids = require('hashids/cjs');
const { v4: uuidv4 } = require('uuid');

var userSchema = new Schema({
  // primary key
  _id: { type: Number },
  // compulsory
  issocial: { type: Boolean, required: true }, // Email with mobile (true) or Custom with mobile (false)
  mobile: { type: String, trim: true, required: true },
  devicetype: { type: String, trim: true, required: true, uppercase: true }, // Android or IOS
  // auto create
  username: { type: String, trim: true }, // unique
  usercode: { type: String, trim: true }, // unique -- Not NULL
  referencecode: { type: String, trim: true, default: null }, // sign up
  referencestarcode: { type: String, trim: true, default: null }, // subscription
  isuserstartype: { type: Boolean, default: false }, // Maximum 10 User for star user
  isreferralbenefitactive: { type: Boolean, default: true }, // alwase true for normal user like as standard user 
  // not require
  userid: { type: String, trim: true, default: null }, // Only For Social Login 
  logintype: { type: String, trim: true, uppercase: true }, // Facebook or Gmail
  email: { type: String, trim: true, default: null },
  password: { type: String, trim: true },
  profilepic: { type: String, trim: true, default: null },
  name: { type: String, trim: true, default: null },
  gender: { type: String, trim: true, default: null },
  dateofbirth: { type: Date, default: null },
  lastname: { type: String, trim: true, default: null },
  // verify register after active user
  isverify: { type: Boolean, default: false },
  // socket connection
  connectionid: { type: String, trim: true },
  online: { type: Boolean, default: true },

  // setting controls
  setting: {
    control: { type: Boolean, default: true }, // Left (true) and Right (false)
    music: { type: Boolean, default: true }, // On (true) and Off (false) 
    sound: { type: Boolean, default: true }, // On (true) and Off (false)  
    vibration: { type: Boolean, default: false }, // On (true) and Off (false)  
    language: { type: String, default: "ENGLISH" },
  },


  address: {
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },

  // level with win
  levelwin: { type: Number, default: 0 },
  userlevelid: { type: Schema.Types.ObjectId, ref: 'Level', default: null },
  useratingid: { type: Schema.Types.ObjectId, ref: 'Rating', default: null },

  // User active or deactive -- Date -- 21-09-2021
  isactive: { type: Boolean, default: true },

  // Start Computer Version 
  // Computer Version Coins 
  totalcoin: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  }, // Computer Coin -- Till Date
  coin: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0,
    min: [0, 'Minimum value is required for coin'],
  }, // Computer Coin -- Current Coin
  computerwin: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  }, //Computer Win - Till date
  computerplaygame: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  }, //Computer Total Play Game - Till date play 
  // End Computer Version 

  // Start Ads Point
  // Ads With Point
  hatsonpoints: {
    type: Number,
    default: 0
  },
  totalhatsonpoints: {
    type: Number,
    default: 0
  },
  hatsonpointswin: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  }, // Total Win Game With Ads -- Till End
  hatsonpointsplaygame: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  }, // Total Play Game With Ads -- Till End
  // End Ads Point

  // Start Point -- Ads Without Point
  // Ads Without Point
  totalwin: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  },// total win game -- Ads Without Point
  totalplay: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i',
    default: 0
  },
  totalpoint: {
    type: Number,
    default: 0
  },
  currentbalanceofpoints: {
    type: Number,
    default: 0,
    min: [0, 'Minimum balance is required.']
  },
  totalwinningpoints: {
    type: Number,
    default: 0
  },
  totaltournamentpoints: {
    type: Number,
    default: 0
  },
  totalreferralpoints: {
    type: Number,
    default: 0
  },
  // End Ads Without Point

  // date
  registerdate: { type: Date, default: new Date() },
  lastopendate: { type: Date },

  /// Invite Friend 
  friendaccept: [{ type: String, ref: 'User', default: [] }],
  friendpending: [{ type: String, ref: 'User', default: [] }],
  friendfacebook: [{ type: String, ref: 'User', default: [] }],


  isavatar: { type: Boolean, default: true },

  isAutoRenewalActive : { type: Boolean, default: false },

  isTermAndCondition : { type: Boolean, default: false }

}, { strict: false, _id: false, versionKey: false });

userSchema.plugin(AutoIncrement, { inc_field: '_id' });

userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});


userSchema.post('save', async (docs, next) => {
  var user = docs;
  var createUserName;
  // if (docs.name == undefined) {
  createUserName = "USER_" + docs.id;
  // } else {
  //   if (docs.name == "") {
  //     createUserName = "USER_" + docs.id;
  //   } else {
  //     createUserName = docs.name.toUpperCase() + "_" + docs.id;
  //   }
  // }
  const hashids = new Hashids(uuidv4(), 8, '0123456789QWERTYUIOPASDFGHJKLZXCVBNM');
  if (docs.username != undefined && docs.username != "" && docs.username != null) {
    await User.findByIdAndUpdate(user._id, { $set: { usercode: hashids.encode(1, 2, 3) } }, { fields: { _id: 0 } });
  } else {
    await User.findByIdAndUpdate(user._id, { $set: { username: createUserName, usercode: hashids.encode(1, 2, 3) } }, { fields: { _id: 0 } });
  }

  next();
});

var User = mongoose.model('USER', userSchema);
module.exports = User;