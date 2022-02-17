var validator = require("validator");

// optional
async function checkLoginPassword(password) {
    if (validator.isEmpty(password, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            code: 1,
            msg: "Password MUST have: \n 6-16 characters \n at least 1 Capital letter \n at least 1 Small letter \n at least 1 number \n at least 1 symbol"
        };
    }
    if (!validator.isStrongPassword(password)) {
        //one small letter, one capital letter and one minSymbols 
        return {
            status: false,
            code: 1,
            msg: "Password MUST have: \n 6-16 characters \n at least 1 Capital letter \n at least 1 Small letter \n at least 1 number \n at least 1 symbol"
        };
    } else {
        return {
            status: true
        };
    }
}

module.exports = { checkLoginPassword };