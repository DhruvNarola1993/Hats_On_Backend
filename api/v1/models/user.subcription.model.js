var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usersubcritionSchema = new Schema({
    // Manually
    username: { type: String, trim: true }, 

    userIp: { type: String, trim: true },

    // Manually
    subscriptionType: { type: String, trim: true },
    subscriptionid: { type: Schema.Types.ObjectId, ref: 'Subscription'},

    // Manually
    subscriptionPurchaseDate: { type: Date },

    // Manually
    subscriptionStartDate: { type: Date },  // Current;y Start Date
    subscriptionEndDate: { type: Date },    // Current;y End Date

    // Manually
    brandSubcriptionCode: { type: String, trim: true },
    // Manually
    promoCode: { type: String, trim: true },

    // Dynamic
    netSubscriptionFee: { type: Number },
    feesandCharges: { type: Number },
    gstCharges: { type: Number },
    totalAmountPaid: { type: Number },

    isExpiry : {type: Boolean, default: false}, 

    isActive: {type: Boolean, default: true}, /// Current Plan Is Active 

    // Dynamic
    createdate: { type: Date, default: new Date() },
    updatedate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false });
var UserSubcription = mongoose.model('USERSUBCRIPTION', usersubcritionSchema);
module.exports = UserSubcription;


// id -- Insert User SubscriptionId Id -- SubscriptionId

// UserId -- Manually
// UserIP
// SubscriptionType -- Daily -- Manually
// SubscriptionPurchaseDate --- Manually

// SubscriptionStartDate -- Manually
// SubscriptionEndDate -- 1 day(24), 7 day(7), 30(30), 90(90) , 365(365) ,

// BrandSubcriptionCode -- Optional -- Manual
// PromoCode -- Optional -- Manual

// NetSubscriptionFee - 1000 (Buy) - 100("10%") --> 900 -- automatic read only
// FeesAndCharges - 100 --> 1000 -- automatic read only
// GSTCharges - Get and set on Keyword --> "20%" --> 200 -- automatic
// TotalAmountPaid --> 1200 -- read only