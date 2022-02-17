const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';
const iv = crypto.randomBytes(16);

async function encrypt(text) {
    try {
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        console.log(text)
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    } catch (error) {
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(JSON.stringify({
            status: false,
            msg: "Request Error",
            data: {
                date: new Date()
            }
        })), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    }
}
async function decrypt(data) {
    try {
        const { iv, content } = data;
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
        return decrpyted.toString();
    } catch (error) {
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(JSON.stringify({
            status: false,
            msg: "Response Error",
            data: {
                date: new Date()
            }
        })), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    }
}

module.exports = { encrypt, decrypt };