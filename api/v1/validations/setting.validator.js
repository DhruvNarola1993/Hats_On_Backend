var validator = require("validator");

// compulsory 
async function checkKey(params) {
    const { key, value } = params;
    if (key.toLowerCase() === "control" || key.toLowerCase() === "music" || key.toLowerCase() === "sound" || key.toLowerCase() === "vibration") {
        var checkvalue = await checkValue(value);
        return checkvalue;
    } else if (key.toLowerCase() === "language") {
        var checkStringvalue = await checkStringValue(value);
        return checkStringvalue;
    } else {
        return {
            status: false,
            msg: "Key is not present."
        };
    }
}


// compulsory 
async function checkValue(value) {
    if (typeof value === "boolean") {
        return {
            status: true
        };
    } else {
        return {
            status: false,
            msg: "Value is not matched type."
        };
    }
}



// compulsory 
async function checkStringValue(value) {
    if(typeof value === "string") { 
        if(validator.isEmpty(value, { ignore_whitespace: true })) {
            // When filed is blank or empty string return true 
            return {
                status: false,
                msg: "Value can not blank."
            };
        } else {
            return {
                status: true
            };
        }
    } else {
        return {
            status: false,
            msg: "Value is not matched type."
        };
    }
}




module.exports = { checkKey };
