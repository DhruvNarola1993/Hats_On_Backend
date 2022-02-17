

/// name, lastname,  --  medentory

/// address 

/// Subcription lete vakat - birthofdate (18 year)
/// Subcription lete vakat - Restricted_States check - medentory

/// 

/// https://eau1-api.asm.skype.com/v1/objects/0-eaua-d1-56eae7c9ebd30b58179a9c929c336a02/views/imgpsh_fullsize_anim

/// Update



/// https://eau1-api.asm.skype.com/v1/objects/0-eaua-d2-0aa9bc7e3aedc9faaaeff1c0c90161b4/views/imgpsh_fullsize_anim

var User = require('../../../api/v1/models/user.model');

/***
 * 
 * @description 
 * 
 */
async function updateServices(params, payload) {
    try {
        const { aud } = payload;
        const { name, lastname, line1, line2, state, city, pincode, email, dateofbirth } = params;
        var userDetails = await User.findOneAndUpdate({ isactive: true, username: aud }, {
            $set: {
                name: name, lastname: lastname, email: email, dateofbirth: new Date(dateofbirth), "address.line1": line1,
                "address.line2": line2, "address.state": state, "address.city": city, "address.pincode": pincode
            }
        }, {
            new: true,
            "fields": {
                name: 1, lastname: 1, email: 1, dateofbirth: 1, address: 1, _id: 0
            }
        });
        if (userDetails != undefined) {
            return {
                status: true,
                data: userDetails
            };
        } else {
            return {
                status: false,
                msg: "Your details could not be updated. Please try again."
            };
        }
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
async function getServices(params, payload) {
    try {
        const { aud } = payload;
        var userDetails = await User.findOne({ isactive: true, username: aud }, {
            name: 1, lastname: 1, email: 1, dateofbirth: 1, address: 1, _id: 0
        });
        if (userDetails != undefined) {
            return {
                status: true,
                data: userDetails
            };
        } else {
            return {
                status: false,
                msg: "Your details could not be display. Please try again."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Your details could not be display. Please try again."
        };
    }
}

module.exports = { updateServices, getServices };

