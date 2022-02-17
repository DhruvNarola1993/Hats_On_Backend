var validator = require("validator");
// Is Empty or null
async function notEmptyAndNull(value) {
    try {
        if (validator.isEmpty(value, { ignore_whitespace: true })) {
            // When filed is blank or empty string return true 
            return {
                status: false,
                msg: "It is blank, Please enter value."
            };
        } else {
            if (value.trim() == "") {
                return {
                    status: false,
                    msg: "It is blank, Please enter value."
                };
            } else {
                return {
                    status: true
                };
            }

        }
    } catch (error) {
        return {
            status: false,
            msg: "Validation Error."
        };
    }
}
// Is Number
async function isNumber(value) {
    try {
        if (typeof value === "number") {
            return {
                status: true
            };
        } else {
            return {
                status: false,
                msg: "It is not number."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Validation Error."
        };
    }
}
// Is Boolean
async function isBoolean(value) {
    try {
        if (typeof value === "boolean") {
            return {
                status: true
            };
        } else {
            return {
                status: false,
                msg: "It is not true/false."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Validation Error."
        };
    }
}
module.exports = { notEmptyAndNull, isNumber, isBoolean };