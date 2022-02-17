var multer = require('multer');
var util = require('util');
const { v4: uuidv1 } = require('uuid');
var CommonValidator = require('./../common/common.validator');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + './../../../public/profile/');
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.split('.');
    cb(null, uuidv1() + '.' + ext[ext.length - 1]);
  }
});

var uploadF = multer({ storage: storage, fileFilter: CommonValidator.imageFilter, preservePath: false });

async function startUploadSingleFile(req, res) {
  let filename;
  try {
    const upload = util.promisify(uploadF.single('fileUpload'));
    await upload(req, res);
    filename = req.file.filename;
    if (filename != undefined) {
      return {
        status: true,
        imageurl: filename
      };
    } else {
      return {
        status: false,
        msg: "File must be require."
      };
    }
  } catch (e) {
    console.log(e)
    return {
      status: false,
      msg: "Only image files are allowed!"
    };
  }
}

module.exports = { startUploadSingleFile };
