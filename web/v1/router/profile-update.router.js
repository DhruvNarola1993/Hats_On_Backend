var { getController, updateController } = require('./../controller/profile-update.controller');
var { verifyAccessToken } = require('./../middleware/auth.middleware');
var express = require('express');
var router = express.Router();
// Update
router.put('/', verifyAccessToken, updateController);
// Send Otp
router.post('/', verifyAccessToken, getController);

// Send Otp
router.post('/state', verifyAccessToken, (req, res) => {
    res.json({
        status: true,
        state: ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        restricateState: ["Assam", "Nagaland", "Odisha", "Sikkim", "Telangana", "Andhra Pradesh", "Karnataka", "Meghalaya"]
    })
});
module.exports = router;