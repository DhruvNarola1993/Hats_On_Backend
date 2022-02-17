var Faq = require('../models/faq.model');

async function listAllFAQ(params) {
    try {
        var listFaq = await Faq.find({}).select({question: 1, answer: 1,_id:0});
        if(listFaq.length >= 0) {
            return {
                status: true,
                listfaq: listFaq
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

module.exports = { listAllFAQ };