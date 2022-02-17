var validator = require("validator");


// compulsory
async function checkName(name) {
    try {
        if(validator.isEmpty(name, { ignore_whitespace: true })) {
            // When filed is blank or empty string return true 
            return {
                status: false,
                msg: "Name is not blank."
            };
        }
        if(!validator.isAlpha(name)) {
            return {
                status: false,
                msg: "Name must be string."
            };
        } else {
            return {
                status: true
            };
        }            
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
    
}

// compulsory 
async function checkQuery(query) {
    if(validator.isEmpty(query, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Query is not blank."
        };
    }
    if(query.length > 14) {
        return {
            status: true
        };
    } else {
        return {
            status: false,
            msg: "Query is not more than 15 character."
        };
    }
}


module.exports = {checkName, checkQuery};