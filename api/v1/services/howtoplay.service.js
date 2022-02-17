
var HowToPlay = require('../models/howtoplay.model');

async function listAllHowToPlay(params) {
    try {
        var listHowToPlay = await HowToPlay.find({}).select({bulletpoint:1 ,_id: 0 });
        if(listHowToPlay.length >= 0) {
            return {
                status: true,
                listhowtoplay: listHowToPlay
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

module.exports = { listAllHowToPlay };