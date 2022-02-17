var Faq = require('../models/faq.model');
var HowToPlay = require('../models/howtoplay.model');
var TermCondition = require('../models/termcondition.model');
var Keyword = require('../models/keyword.model');
var Rating = require('../models/rating.model');
var Computercoin = require('../models/computercoin.model');
var User = require('../models/user.model');
var StarUser = require('../models/star.panel.model');
var Message = require('../models/message.model');
var Chat = require("../models/chat.model");
const client = require('./../../../connection/redisconnection')
_ = require('lodash');
// Faq, Term and Condition, How TO Play, Keyword, Level and Rating(pro version), ComputerCoin (Play with Computer)
async function listInit() {
    try {
        var getFaq = await client.get('listfaq')
        var getListterm = await client.get('listterm')
        var getListhowtoplay = await client.get('listhowtoplay')
        var getListComputercoin = await client.get('listHcoin')
        var getListRatingLevel = await client.get('listRatingLevel')
        var getListKeyword = await client.get('listKeyword')
        var getListChat = await client.get('listchat');

        /// User Code List
        var listUser = await StarUser.find({})
            .select({ usercode: 1, profilepic: 1, _id: 0 });

        // var listUser = await StarUser.find({ isuserstartype: true, isreferralbenefitactive: true, isactive: true, isverify: true })
        //     .select({ usercode: 1, profilepic: 1, _id: 0 });

        var getMessage = await client.get('listMessage')
        if (getMessage == null) {
            var listMessage = await Message.find({}).select({ key: 1, uniquecode: 1, message: 1, _id: 0 })
            listMessage = await client.set('listMessage', JSON.stringify(listMessage));
            getMessage = await client.get('listMessage')
        }

        if (getFaq == null || getFaq == true ||
            getListterm == null || getListterm == true ||
            getListhowtoplay == null || getListhowtoplay == true ||
            getListComputercoin == null || getListComputercoin == true ||
            getListRatingLevel == null || getListRatingLevel == true ||
            getListKeyword == null || getListKeyword == true ||
            getListChat == null || getListChat == true
        ) {
            var listFaq = await Faq.find({}).select({ question: 1, answer: 1, _id: 0 });
            getFaq = await client.set('listfaq', JSON.stringify(listFaq));

            var listTerm = await TermCondition.find({}).select({ bulletpoint: 1, _id: 0 });
            listTerm = _.map(listTerm, "bulletpoint");
            getListterm = await client.set('listterm', JSON.stringify(listTerm));

            var listHowToPlay = await HowToPlay.find({}).select({ bulletpoint: 1, _id: 0 });
            listHowToPlay = _.map(listHowToPlay, "bulletpoint");
            getListhowtoplay = await client.set('listhowtoplay', JSON.stringify(listHowToPlay));


            var listComputercoin = await Computercoin.find().select({ coins: 1, _id: 0 });
            listComputercoin = _.map(listComputercoin, "coins");
            getListComputercoin = await client.set('listHcoin', JSON.stringify(listComputercoin));

            var listChat = await Chat.find({}).select({ question: 1, answer: 1, _id: 0 });
            getListChat = await client.set('listchat', JSON.stringify(listChat));

            var listKeyword = await Keyword.find({}).select({ key: 1, value: 1, _id: 0 });
            /// Keyword Object and add key and value
            var obj = {};
            if (listKeyword.length >= 0) {
                for (var index = 0; index < listKeyword.length; index++) {
                    var key = listKeyword[index].key;
                    var value = listKeyword[index].value;
                    obj[key] = value;
                }
            }
            getListKeyword = await client.set('listKeyword', JSON.stringify(obj));

            /// Rating and Level Data
            var listRating = await Rating.aggregate().lookup({
                from: "levels",
                localField: "_id",
                foreignField: "ratingid",
                as: "levels"
            }).project({
                "_id": 0, "rateno": "$rateno", "minplayer": "$minplayer", "maxplayer": "$maxplayer", "levels._id": 1,
                "levels.levelno": 1, "levels.point": 1, "levels.ratingid": 1, "levels.winlevel": 1, "levels.movelevelid": 1
            });
            getListRatingLevel = await client.set('listRatingLevel', JSON.stringify(listRating));


            return {
                status: true,
                listfaq: listFaq,
                listterm: listTerm,
                listhowtoplay: listHowToPlay,
                listKeyword: obj,
                listRatingLevel: listRating,
                listHcoin: listComputercoin,
                listChat: listChat,
                listStarUser: listUser
            };

        } else {
            //console.log("****************************************")
            //console.warn("data")
            //console.log("****************************************")
            return {
                status: true,
                listfaq: JSON.parse(getFaq),
                listterm: JSON.parse(getListterm),
                listhowtoplay: JSON.parse(getListhowtoplay),
                listKeyword: JSON.parse(getListKeyword),
                listRatingLevel: JSON.parse(getListRatingLevel),
                listHcoin: JSON.parse(getListComputercoin),
                listChat: JSON.parse(getListChat),
                listStarUser: listUser
            };
        }

    } catch (error) {
        //console.log(error)
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { listInit };