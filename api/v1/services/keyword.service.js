
var Keyword = require('../models/keyword.model');

async function listAllKeyword(params) {
    try {
        var listKeyword = await Keyword.find({}).select({ key: 1, value: 1, _id: 0 });
        if (listKeyword.length >= 0) {
            var array = [];
            var obj = {};
            for (var index = 0; index < listKeyword.length; index++) {
                var key = listKeyword[index].key;
                var value = listKeyword[index].value;
                obj[key] = value;
                // array.push(obj);
            }
            return {
                status: true,
                listKeyword: obj
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
            msg: error
        };
    }
}

module.exports = { listAllKeyword };