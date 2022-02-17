const compression = require('compression');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// https://stackoverflow.com/questions/62396498/tslint-marks-body-parser-as-deprecated
// parse application/json
app.use(express.json());
app.use(cors());
app.use(compression());
app.use('/admin', require('./../admin/v1/admin'));
/// image set 
app.use(express.static(path.join(__dirname, './../public')));
// Send all other requests to the Angular app
app.use(express.static(path.join(__dirname, './../dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './../dist/index.html'));
});
app.use('/web', require('./../web/v1/web'));
// Middleware
app.use(function (req, res, next) {
    console.log(req.baseUrl);
    var err = {};
    err.status = 404;
    err.msg = "Not Found";
    next(res.status(404).json({data: "Error on Router"}));
});
module.exports = app;