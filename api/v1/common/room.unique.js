const Hashids = require('hashids/cjs');
const { v4: uuidv4 } = require('uuid');


// Hashids Unique
async function uniquehashid(value) {
    try {
        var stringHash = uuidv4() + value + new Date();
        const hashids = new Hashids(stringHash, 6, '1234567890AaBbCc');
        var createHash = hashids.encode(1, 2, 3);
        return {
            status: true,
            createHash: createHash
        };
    } catch (error) {
        //console.log(error);
        return {
            status: false,
            msg: "Create Room Error."
        };
    }
}

module.exports = { uniquehashid };