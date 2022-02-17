// https://eau1-api.asm.skype.com/v1/objects/0-eaua-d1-cb753dbfe3356a6552afd608761ac763/views/imgpsh_fullsize_anim

var UserSubcription = require("./../../../api/v1/models/user.subcription.model");
var Subcription = require('./../../../api/v1/models/subscription.model'); // This is application User
var User = require('./../../../api/v1/models/user.model');
var moment = require("moment");
/***
 * 
 * @description 
 * 
 * Auto reneval Flag -- Update
 * 
 * History Subcription List 
 *         Type, Purcse Date, Start Date, End Date, -- Maxmim One year Old Data 
 *          Invoice 
 *              FIrst Name, Last Name, Address, Mobile , Email, 
 *          Invoice No, Purchase Date, Total Subcription Fee, Promo Code Discounts, Net Subscription Fes, Fee & Charges, GST, Total Payment    
 * 
 * 
 * 
 * Current Subscription
 * 
 *          Type And Start Date And Date
 * 
 */
async function listSubcriptionServices(params, payload) {
    try {
        const { aud } = payload;
        var listSubcription = await Subcription.find({ isactive: true }).select({
            name: 1, fees: 1, feesandcharges: 1, starreferralpercentage: 1,
            standardreferralpoints: 1
        });
        var currentSubscription = await User.findOne({ isactive: true, username: aud }, { _id: 0, isAutoRenewalActive: 1 });
        var allSubscription = await UserSubcription.find({ username: aud });
        return {
            status: true,
            data: {
                listSubcription,
                currentSubscription,
                allSubscription
            }
        };
    } catch (error) {

        return {
            status: false,
            msg: error
        };
    }
}


/***
 * 
 * @description 
 * 
 */
async function checkMobileStarcodeServices(params, payload) {
    try {
        const { aud } = payload;
        var userDetails = await User.findOne({ isactive: true, username: aud }).select({
            mobile: 1, _id: 0, name: 1, lastname: 1, "address": 1, "dateofbirth": 1
        });
        if (userDetails != undefined) {
            const isLegal = false;
            if (userDetails.dateofbirth != null) {
                const age = moment().diff(userDetails.dateofbirth, 'years');
                isLegal = (age >= 18);
            } 
            userDetails["b"]
            return {
                status: true,
                data: userDetails
            };
        } else {
            return {
                status: false,
                msg: "Please Login Again. "
            };
        }
    } catch (error) {

        return {
            status: false,
            msg: error
        };
    }
}


/// This api 
//// http://143.110.183.1:6051/web/subcription/brand

//// Brand Subcription Differnt Code - 
//// Star Code - 
//// IsStarCodeCompulsoryOnSubscription - true - Star Code - mendotry
//// IsStarCodeCompulsoryOnSubscription - true - Star Code - not mendotry


/// When Pay Now --- Subcription Date == null ? new Date() : momment(new Date(subscription)).startOf('date');



/// Payout Table

/// Start Amount 10-1000
/// 1001-

module.exports = { listSubcriptionServices, checkMobileStarcodeServices };

