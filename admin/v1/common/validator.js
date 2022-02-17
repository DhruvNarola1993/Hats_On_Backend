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
            return {
                status: true
            };
        }
    } catch (error) {
        console.log(error);
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
        console.log(error);
        return {
            status: false,
            msg: "Validation Error."
        };
    }
}
// Mongodb -- Object Id Validation
async function isObjectID(value) {
    try {
        if (validator.isMongoId(value)) {
            return {
                status: true
            };
        } else {
            return {
                status: false,
                msg: "It have not current value."
            };
        }
    } catch (error) {
        console.log(error);
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
module.exports = { notEmptyAndNull, isNumber, isObjectID, imageFilter };