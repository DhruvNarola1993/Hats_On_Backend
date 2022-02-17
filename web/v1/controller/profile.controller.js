const { updatethemefile } = require('../helper/profile.helper');
const { startUploadSingleFile } = require('../middleware/file.upload');
var path = require('path');
var fs = require('fs');
// Update One File
exports.updateUserProfileFile = async (req, res, next) => {
    var response = await startUploadSingleFile(req, res);
    if (response.status) {
        console.log(response)
        req.body.imageurl = response.imageurl;
        var deleteFile = response.imageurl;
        console.log(req.body)
        response = await updatethemefile(req.body);
        // if (response.status == false) {
        //     var deletePath = path.join(__dirname, process.env.IMAGEPATH, deleteFile);
        //     await fs.unlink(deletePath, (err) => { });
        // } else if (response.status == true) {
        //     var deletePath = path.join(__dirname, process.env.IMAGEPATH, response.data.imageurl);
        //     await fs.unlink(deletePath, (err) => { });
        // }
        res.json(response);
    } else {
        res.json(response);
    }
};