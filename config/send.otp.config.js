const axios = require("axios");

async function sendSms(data) {
    const { mobile } = data;
    const params = new URLSearchParams();
    const randomNumber = Math.floor((Math.random() * 10000) + 1);
    params.append('apikey', "NGY0OTQ4Mzg2YjcxNGI3MjRlNzMzNDM4NmMzNjcyNWE=");
    params.append('numbers', mobile);
    params.append('sender', "HATSON");
    params.append('test', true);
    params.append('message', `Your Hats On one-time password (OTP) is ${randomNumber}. This is valid for 15 minutes and is usable only once. Please do not share with anyone.\nTeam Hats On.`);
    const request = await axios.post('https://api.textlocal.in/send/', params);
    // status: 'failure'
    // status: 'success'
    if (request.data.status == "success") {
        // otpNo : randomNumber
        return {
            status: true,
            otpNo : "1234"
        }
    } else {
        return {
            status: false
        }
    }
}

module.exports = { sendSms };