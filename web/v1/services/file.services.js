const fs = require('fs');
var User = require('./../../../api/v1/models/user.model');


// Update With File
async function oneUpdateFile(params) {
    try {
        const { username, imageurl } = params;
        console.log(params)
        var updateOne = await User.findOneAndUpdate({ username: username }, { $set: { profilepic: imageurl, isavatar: false } }, {
            new: true, fields: {
                "profilepic": 1
            }
        });
        if (updateOne != null) {
            return {
                status: true,
                data: updateOne
            };
        } else {
            return {
                status: false,
                msg: "Profile picuture is not update."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { oneUpdateFile };