const { insertone, getall, deleteone, updateone } = require('../helper/hording.helper');
const { startUploadSingleFile } = require('../middleware/file.upload');
var path = require('path');
var fs = require('fs');


exports.getList = async (req, res, next) => {
    var response = await getall(req.body);
    res.json(response);
};
// 
exports.insertOne = async (req, res, next) => {
    var response = await startUploadSingleFile(req, res);
    if (response.status) {
        req.body.imageurl = response.imageurl;
        response = await insertone(req.body);
        res.json(response);
    } else {
        res.json(response);
    }
};
// 
exports.updateOne = async (req, res, next) => {
    var response = await startUploadSingleFile(req, res);
    req.body._id = req.params.id;
    if (response.status) { 
        req.body.imageurl = response.imageurl;
        var deleteFile = response.imageurl;
        response = await updateone(req.body);
        if (response.status == false) {
            var deletePath = path.join(__dirname, process.env.HORDINGPATH, deleteFile);
            await fs.unlink(deletePath, (err) => { });
        } else if (response.status == true) {
            var deletePath = path.join(__dirname, process.env.HORDINGPATH, response.data.hording);
            await fs.unlink(deletePath, (err) => { });
        }
        res.json(response);
    } else {
        res.json(response);
    }
};
// Delete 
exports.deleteOne = async (req, res, next) => {
    var response = await deleteone(req.params);
    if(response.status) {
        var deletePath = path.join(__dirname, process.env.HORDINGPATH, response.data.hording);
        await fs.unlink(deletePath, (err) => { });
    }
    res.json(response);
};