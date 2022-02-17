var Contact = require('../models/contactus.model');

async function saveContact(params) {
    try {
        var insertContact = await new Contact(params);
        insertContact = await insertContact.save();
        if(insertContact != undefined) {
            return {
                status: true,
                msg: "Thank you for your query! We will get back to you in 2-3 days.",
            };
        } else {
            return {
                status: false,
                msg: "Your request could not be submitted. Please try again.",
            };
        }        
    } catch (error) {
        return {
            status: false,
            msg: "Your request could not be submitted. Please try again.",
        };
    }
}

module.exports = { saveContact };
