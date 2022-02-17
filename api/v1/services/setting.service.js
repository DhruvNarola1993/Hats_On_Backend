const User = require('../models/user.model');

async function updateSetting(params) {
    try {
        const { mobile, key, value } = params;
        var updateUser;
        if (key.toLowerCase() === "control") {
            updateUser = await User.findOneAndUpdate({ mobile: mobile },
                { $set: { "setting.control": value } },
                { "fields": { "setting.control": 1 }, new: true });
        } else if (key.toLowerCase() === "music") {
            updateUser = await User.findOneAndUpdate({ mobile: mobile },
                { $set: { "setting.music": value } },
                { "fields": { "setting.music": 1 }, new: true });
        } else if (key.toLowerCase() === "sound") {
            updateUser = await User.findOneAndUpdate({ mobile: mobile },
                { $set: { "setting.sound": value } },
                { "fields": { "setting.sound": 1 }, new: true });
        } else if (key.toLowerCase() === "vibration") {
            updateUser = await User.findOneAndUpdate({ mobile: mobile },
                { $set: { "setting.vibration": value } },
                { "fields": { "setting.vibration": 1 }, new: true });
        } else if (key.toLowerCase() === "language") {
            updateUser = await User.findOneAndUpdate({ mobile: mobile },
                { $set: { "setting.language": value.toUpperCase() } },
                { "fields": { "setting.language": 1 }, new: true });
        } else {
            updateUser = null;
        }
        if (updateUser != null) {
            return {
                status: true,
                settingUpdate: updateUser
            };
        } else {
            return {
                status: false,
                msg: "Something went wrong. Please restart the App and try again."
            };
        }

    } catch (error) {
        return {
            status: false,
            msg: "Something went wrong. Please restart the App and try again."
        };
    }

}

module.exports = { updateSetting };