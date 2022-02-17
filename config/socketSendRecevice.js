var config = require('./common.config');
var moment = require('moment');
var enkey = 'DAED19E749D0C068';
var crypto = require('crypto');

module.exports = {
    sendMsgToUser: function (socket, en, msg) {
        // console.log(en, "------" ,msg);
        var xx = _common.Enc(msg);
        var send = {
            final: xx
        };
        console.log(moment(new Date()), "------", en, "------", msg);
        socket.emit(en, send);
        // socket.emit(en,msg);

    },

    receiveMsgFromUser: function (data) {
        // console.log("body-------------", data);
        var reqData = data.final;
        // console.log("final--", reqData);
        var final = "";
        if (reqData) {
            // console.log("if");
            final = _common.Dec(reqData);
        }
        console.log(moment(new Date()), "------", final);
        return final;
    },
    Dec: function (data) {
        var keyBuf = Buffer.from(enkey);
        var deCipher = crypto.createDecipheriv('aes128', keyBuf, keyBuf);
        try {
            decrypted = deCipher.update(data, 'base64', 'utf8') + deCipher.final('utf8');
            return JSON.parse(decrypted);
        } catch (e) {
            return null;
        }

    },
    Enc: function (toCrypt) {
        var keyBuf = Buffer.from(enkey);
        var cipher = crypto.createCipheriv('aes128', keyBuf, keyBuf);
        try {
            output = cipher.update(JSON.stringify(toCrypt), 'utf-8', 'base64') + cipher.final('base64');
            return output;
        } catch (e) {
            return null;
        }

    },
    sendMsgToSingleUser: function (IO, socket, en, msg) {
        if (config.isEncrypt) {
            console.log(moment(new Date()), "------", en, "------", msg);
            if (config.isLog)
                console.log(moment(new Date()), "------", en, "------", msg);
            var xx = _common.Enc(msg);
            var send = {
                final: xx
            };
            if (config.isLog)
                console.log(moment(new Date()), "------", en, "------", xx);
            IO.to(socket).emit(en, send);
        } else {
            IO.to(socket).emit(en, msg);
        }
    },
    // All User Send in Room
    sendMsgToAllUser: function (IO, roomname, en, msg) {
        if (config.isEncrypt) {
            if (config.isLog)
                console.log(moment(new Date()), "------", en, "------", msg);
            var xx = _common.Enc(msg);
            var send = {
                final: xx
            };
            if (config.isLog)
                console.log(moment(new Date()), "------", en, "------", xx);
            IO.in(roomname).emit(en, send);
        } else {
            IO.in(roomname).emit(en, msg);
        }
    },
    // Except User Send in Room
    sendMsgToExceptUser: function (socket, roomname, en, msg) {
        if (config.isEncrypt) {
            if (config.isLog)
                console.log(moment(new Date()), "------", en, "------", msg);
            var xx = _common.Enc(msg);
            var send = {
                final: xx
            };
            if (config.isLog)
                console.log(moment(new Date()), "------", en, "------", xx);
            socket.to(roomname).emit(en, send);
        } else {
            socket.to(roomname).emit(en, msg);
        }
    },
};
