
var TermCondition = require('../models/termcondition.model');

async function listAllTerm(params) {
    try {
        var listTerm = await TermCondition.find({}).select({bulletpoint: 1,_id:0});
        if(listTerm.length >= 0) {
            return {
                status: true,
                listterm: listTerm
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

module.exports = { listAllTerm };