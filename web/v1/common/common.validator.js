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
            // 
            if(value.trim() != "") {
                return {
                    status: true
                }; 
            } else {
                return {
                    status: false,
                    msg: "It is blank, Please enter value."
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
// Is boolean
async function isBoolean(value) {
    try {
        if (typeof value === "boolean") {
            return {
                status: true
            };
        } else {
            return {
                status: false,
                msg: "It is not boolean."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "Validation Error."
        };
    }
}

// Password
async function checkPassword(password) {
    if(validator.isEmpty(password, { ignore_whitespace: true })) {
        // When filed is blank or empty string return true 
        return {
            status: false,
            msg: "Password is not blank."
        };
    }
    if(!validator.isStrongPassword(password)) {
        //one small letter, one capital letter and one minSymbols 
        return {
            status: false,
            msg: "Password must have one small letter,one capital letter,one symbols and one number."
        };
    } else {
        return {
            status: true
        };
    }
}

// Mobile Validator
async function checkMobile(value) {
    try {
        if(validator.isMobilePhone(value, ['en-IN'])) {
            // When filed is blank or empty string return true 
            return {
                status: true
            };
        } else {
            return {
                status: false
            };
        }  
    } catch (error) {
        return {
            status: false,
            msg: "Validation Error."
        };
    }
   
}


// Not 
// Image Filter
async function imageFilter(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}
module.exports = { notEmptyAndNull, isNumber, isBoolean, checkPassword, checkMobile, imageFilter };