var validator = require("validator");

// compulsory 
async function checkGender(gender) {
    if(validator.isEmpty(gender, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Gender is not blank."
        };
    }
    if(gender.toUpperCase() === "MALE" || gender.toUpperCase() === "FEMALE") {
        return {
            status: true
        };
    } else {
        return {
            status: false,
            msg: "Gender is not blank."
        };
    }
}

// compulsory
async function checkDOB(dob) {
    if(validator.isEmpty(dob, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "DOB is not blank."
        };
    } else {
        return {
            status: true
        };
    }
    
}


module.exports = {checkGender, checkDOB};
