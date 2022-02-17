const User = require('../models/user.model');

// logic for email update (email is unique, but may be blank.)
async function checkEmail(params) {
    try {
        const { email, mobile } = params;
        var countEmailUser = await User.countDocuments({ email: email });
        if (countEmailUser == 0) {
            return {
                status: true
            };
        } else if (countEmailUser == 1) {
            var findEmailUser = await User.findOne({ mobile: mobile }).select({ email: 1 });
            if (findEmailUser.email == email) {
                return {
                    status: true,
                    msg: "Your details have been updated."
                };
            } else {
                return {
                    status: false,
                    msg: "Email already registered. Please use a different email."
                };
            }
        } else {
            return {
                status: false,
                msg: "Email already registered. Please use a different email."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

async function updateProfile(params) {
    try {
        const { mobile, name, lastname, email, gender, dateofbirth } = params;
        var countEmail = await checkEmail(params);
        if (countEmail.status) {
            var updateUser = await User.findOneAndUpdate({ mobile: mobile },
                { $set: { email: email, name: name, lastname: lastname, gender: gender, dateofbirth: new Date(dateofbirth) } },
                { "fields": { email: 1, name: 1, lastname: 1, gender: 1, dateofbirth: 1 }, new: true });
            if (updateUser != null) {
                return {
                    status: true,
                    profile: updateUser
                };
            } else {
                return {
                    status: false,
                    msg: "Profile cound not be updated."
                };
            }
        } else {
            return {
                status: false,
                msg: "Email already registered. Please use a different email."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }

}

module.exports = { checkEmail, updateProfile };