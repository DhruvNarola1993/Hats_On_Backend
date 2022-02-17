const UserSubcription = require('../models/user.subcription.model');

async function checkSubscription(params) {
    try {
        const { username } = params;
        var subscriptionId = await UserSubcription.findOne({ username: username, isExpiry: false, isActive: true });
        if(subscriptionId != null) {
            return {
                status: true
            }
        } else {
            return {
                status: false
            }
        }
    } catch (error) {
        return {
            status: false
        };
    }
}


async function socialcheckSubscription(params) {
    try {
        const { username } = params;
        var subscriptionId = await UserSubcription.findOne({ username: username, isExpiry: false, isActive: true });
        if(subscriptionId != null) {
            return {
                status: true
            }
        } else {
            return {
                status: false
            }
        }
    } catch (error) {
        return {
            status: false
        };
    }
}

module.exports = { checkSubscription, socialcheckSubscription };