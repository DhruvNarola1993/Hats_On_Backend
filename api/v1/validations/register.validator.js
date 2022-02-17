var validator = require("validator");
const { messageCode } = require("../services/message.service");

// compulsory
async function checkMobile(mobile) {
    try {
        var errorMessage;
        if(validator.isEmpty(mobile, { ignore_whitespace: true })) {
            // When filed is blank or empty string return true 
            // errorMessage = await messageCode(1000);
            return {
                status: false,
                msg: "Invalid Mobile Number. \n Please Try Again."
            };
        }
        if(!validator.isMobilePhone(mobile)) {
            // errorMessage = await messageCode(1001);
            return {
                status: false,
                msg: "Invalid Mobile Number. \n Please Try Again."
            };
        } else {
            return {
                status: true
            };
        }            
    } catch (error) {
        // Invalid Mobile or Password. Please try again.
        // Mobile not registered. Please Sign Up.
        var catchErrorMessage = await messageCode(1001);
        return {
            status: false,
            msg: error
        };
    }
    
}

// compulsory 
async function checkDevicetype(devicetype) {
    if(validator.isEmpty(devicetype, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Device Type is not blank."
        };
    }
    if(devicetype.toUpperCase() === "ANDROID" || devicetype.toUpperCase() === "IOS") {
        return {
            status: true
        };
    } else {
        return {
            status: false,
            msg: "Device Type is not matched."
        };
    }
}

// compulsory 
async function checkLogintype(logintype) {
    if(validator.isEmpty(logintype, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Login Type is not blank."
        };
    }
    if(logintype.toUpperCase() === "FACEBOOK" || logintype.toUpperCase() === "GMAIL" || logintype.toUpperCase() === "APPLE") {
        return {
            status: true
        };
    } else {
        return {
            status: false,
            msg: "Login Type is not matched."
        };
    }
}

// optional
async function checkEmail(email) {
    if(validator.isEmpty(email, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Invalid Email. \n Please Try Again."
        };
    } 
    if(!validator.isEmail(email)) {
        // Email format is not match, return true
        return {
            status: false,
            msg: "Invalid Email. \n Please Try Again."
        };
    } else {
        return {
            status: true
        };
    }
}

// optional
async function checkPassword(password) {
    if(validator.isEmpty(password, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Password MUST have: \n 6-16 characters \n at least 1 Capital letter \n at least 1 Small letter \n at least 1 number \n at least 1 symbol"
        };
    }
    if(!validator.isStrongPassword(password)) {
        //one small letter, one capital letter and one minSymbols 
        return {
            status: false,
            msg: "Password MUST have: \n 6-16 characters \n at least 1 Capital letter \n at least 1 Small letter \n at least 1 number \n at least 1 symbol"
        };
    } else {
        return {
            status: true
        };
    }
}

module.exports = {checkMobile, checkLogintype, checkDevicetype, checkEmail, checkPassword}; 