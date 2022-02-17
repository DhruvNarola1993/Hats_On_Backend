var Tournament = require('./../../../api/v1/models/tournament.model');
var User = require('./../../../api/v1/models/user.model');
var Tournamentuser = require('./../../../api/v1/models/tournamentuser.model');
var _ = require("lodash");
// All Data 
async function getAll(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
        var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
        var documentLimit = parseInt(pageSize);
        var countTotal = 0;
        var sortorder = sortOrder == "desc" ? -1 : 1; // Server Get Point Order asc or desc  
        var sortkey = sortKey;
        var sortObject = {};
        sortObject[sortkey] = sortorder;
        var findAll;
        if (search != "") {
            countTotal = await Tournament.countDocuments({ "name": { "$regex": search, "$options": 'i' } });
            findAll = await Tournament.aggregate([
                { $sort: sortObject },
                { $match: { "name": { "$regex": search, "$options": 'i' } } },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        } else {
            countTotal = await Tournament.countDocuments();
            findAll = await Tournament.aggregate([
                { $sort: sortObject },
                { $lookup: { from: "admins", localField: "updateby", foreignField: "_id", as: "document" } },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$document", 0] }, "$$ROOT"] } }
                },
                { $project: { document: 0 } },
                { "$skip": documentSkip },
                { "$limit": documentLimit }
            ]);
        }
        if (findAll.length > 0) {
            return {
                status: true,
                data: {
                    dataSource: findAll,
                    length: countTotal
                }
            };
        } else {
            return {
                status: false,
                msg: "Tournament is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
/// Tournament Save
// Insert
async function insertOne(params) {
    try {
        params.createdate = new Date();
        params.updatedate = new Date();
        params.createby = params.updateby;
        var tournamentRound = params.numberofround;
        var arrayRound = [];
        for (let index = 0; index < tournamentRound; index++) {
            var isfirstround = false;
            if (index == 0) {
                isfirstround = true;
            }
            var objectSave = {
                roundentrystartdatetime: new Date(),
                roundstarttime: new Date(),
                roundpoints: 0,
                roundnumber: parseInt(index + 1),
                roundstatus: 'ACTIVE',
                isfirstround: isfirstround
            }
            arrayRound.push(objectSave);
        }
        params.rounds = arrayRound;
        var insertData = await new Tournament(params);
        inserData = await insertData.save();
        if (insertData != null) {
            return {
                status: true,
                data: insertData
            };
        } else {
            return {
                status: false,
                msg: "Tournament error."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Update One Data
async function getUpdateOne(params) {
    try {
        const {
            _id,
            type,
            winnerpoint,
            maxplayers,
            registeropendatetime,
            registerclosedatetime,
            registerpointsperuser,
            numberofround,
            starcode,
            name,
            updateby
        } = params;
        var findOne;
        if (type !== "SPEEDY") {
            findOne = await Tournament.findByIdAndUpdate(_id, {
                $set: {
                    type: type,
                    winnerpoint: winnerpoint,
                    maxplayers: maxplayers,
                    registeropendatetime: registeropendatetime,
                    registerclosedatetime: registerclosedatetime,
                    registerpointsperuser: registerpointsperuser,
                    starcode: starcode,
                    numberofround: numberofround,
                    updatedate: new Date(),
                    name: name,
                    updateby: updateby
                }
            }, { new: true });
        } else {
            const { speedytournamentearlypointsregister } = params;
            findOne = await Tournament.findByIdAndUpdate(_id, {
                $set: {
                    type: type,
                    winnerpoint: winnerpoint,
                    maxplayers: maxplayers,
                    registeropendatetime: registeropendatetime,
                    registerclosedatetime: registerclosedatetime,
                    registerpointsperuser: registerpointsperuser,
                    speedytournamentearlypointsregister: speedytournamentearlypointsregister,
                    starcode: starcode,
                    numberofround: numberofround,
                    updatedate: new Date(),
                    name: name,
                    updateby: updateby
                }
            }, { new: true });
        }

        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Tournament is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Delete
async function oneDelete(params) {
    try {
        const { id } = params;
        var deleteOne = await Tournament.findByIdAndUpdate(id, { $set: { isdisplay: false } });
        if (deleteOne != null) {
            await Tournamentuser.updateMany({ tournamentid: id }, { $set: { isdelete: true } });
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Tournament is not delete."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

/// Tournament Save
// Insert
async function insertRoundOne(params) {
    try {
        const { _id, roundentrystartdatetime, roundstarttime, roundpoints, roundnumber } = params;
        var insertData = await Tournament.findByIdAndUpdate(_id, {
            "$addToSet": {
                "rounds": {
                    "roundentrystartdatetime": new Date(roundentrystartdatetime),
                    "roundstarttime": new Date(roundstarttime),
                    "roundpoints": roundpoints,
                    "isfirstround": false,
                    "roundnumber": parseInt(roundnumber),
                    "roundstatus": "ACTIVE"
                }
            }
        }, { "fields": { _id: 1 } });
        if (insertData != null) {
            return {
                status: true,
                data: insertData
            };
        } else {
            return {
                status: false,
                msg: "Tournament error."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Delete
async function oneRoundDelete(params) {
    try {
        const { id } = params;
        var deleteOne = await Tournament.findOneAndUpdate({ "rounds._id": id }, { "$pull": { "rounds": { "_id": id } } })
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Tournament-Round is not delete."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Update
async function oneRoundUpdate(params) {
    try {
        const { id, roundentrystartdatetime, roundstarttime, roundpoints, roundnumber } = params;
        // roundstatus
        var deleteOne = await Tournament.findOneAndUpdate({ "rounds._id": id }, {
            "$set": {
                "rounds.$.roundentrystartdatetime": roundentrystartdatetime,
                "rounds.$.roundstarttime": roundstarttime,
                "rounds.$.roundpoints": roundpoints,
                "rounds.$.roundnumber": roundnumber
            }
        }, { new: true, "fields": { "_id": 1 } });
        if (deleteOne != null) {
            return {
                status: true,
                data: deleteOne
            };
        } else {
            return {
                status: false,
                msg: "Tournament-Round is not delete."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


// Update User Complete or 
async function oneUpdateAll(params) {
    try {
        const { id, isreturnpayment, type, registerstatus, isplaytournament, status } = params;
        if (registerstatus == "CLOSED") {
            if (isreturnpayment) {
                if (type == "SPEEDY") {
                    var getTournamentStatus = await Tournament.findById(id);
                    if (getTournamentStatus.registerstatus != "CONFIRED") {
                        var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "REFUNDED", isreturnpayment: isreturnpayment } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1 } });
                        var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                        if (getTournamentUser.length > 0) {
                            if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                                var getUserlist = _.map(getTournamentUser, "username");
                                await User.updateMany({ username: { $in: getUserlist } }, { $inc: { hatsonpoints: getTournament.speedytournamentearlypointsregister } })
                            } else {
                                var getUserlist = _.map(getTournamentUser, "username");
                                await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.speedytournamentearlypointsregister } })

                                /// Create by abhineet
                                var sendList = await User.find({ username: { $in: getUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                                for (let index = 0; index < sendList.length; index++) {
                                    const element = sendList[index];
                                    IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                                }
                            }
                        }
                    } else if (getTournamentStatus.registerstatus == "CONFIRED") {
                        var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "REFUNDED", isreturnpayment: isreturnpayment } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1, registerpointsperuser: 1 } });
                        var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                        if (getTournamentUser.length > 0) {
                            if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                                var getUserlist = _.map(getTournamentUser, "username");
                                await User.updateMany({ username: { $in: getUserlist } }, { $inc: { hatsonpoints: getTournament.speedytournamentearlypointsregister + getTournament.registerpointsperuser } })
                            } else {
                                var getUserlist = _.map(getTournamentUser, "username");
                                await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.speedytournamentearlypointsregister + getTournament.registerpointsperuser } })

                                /// Create by abhineet
                                var sendList = await User.find({ username: { $in: getUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                                for (let index = 0; index < sendList.length; index++) {
                                    const element = sendList[index];
                                    IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                                }
                            }
                        }
                    }
                } else {
                    var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "REFUNDED", isreturnpayment: isreturnpayment } }, { new: true, "fields": { _id: 1, registerpointsperuser: 1 } });
                    var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                    if (getTournamentUser.length > 0) {
                        if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                            var getUserlist = _.map(getTournamentUser, "username");
                            await User.updateMany({ username: { $in: getUserlist } }, { $inc: { hatsonpoints: getTournament.registerpointsperuser } })
                        } else {
                            var getUserlist = _.map(getTournamentUser, "username");
                            await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.registerpointsperuser } });

                            /// Create by abhineet
                            var sendList = await User.find({ username: { $in: getUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                            for (let index = 0; index < sendList.length; index++) {
                                const element = sendList[index];
                                IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                            }
                        }
                    }
                }
            } else if (!isreturnpayment) {
                var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "CANCEL", isreturnpayment: isreturnpayment  } }, { new: true, "fields": { _id: 1, registerpointsperuser: 1 } });
            }
        } else if (isreturnpayment && !isplaytournament) {
            //// && status == "ACTIVE" by abhineet update date - 18-01-2022
            // all user repayment 
            if (type == "SPEEDY") {
                if (registerstatus != "CONFIRED") {
                    var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "REFUNDED", isreturnpayment: isreturnpayment } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1 } });
                    var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                    if (getTournamentUser.length > 0) {
                        if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                            var getUserlist = _.map(getTournamentUser, "username");
                            await User.updateMany({ username: { $in: getUserlist } }, { $inc: { hatsonpoints: getTournament.speedytournamentearlypointsregister } })
                        } else {
                            var getUserlist = _.map(getTournamentUser, "username");
                            await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.speedytournamentearlypointsregister } })
                            /// Create by abhineet
                            var sendList = await User.find({ username: { $in: getUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                            for (let index = 0; index < sendList.length; index++) {
                                const element = sendList[index];
                                IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                            }
                        }
                    }
                } else if (registerstatus == "CONFIRED") {
                    var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "REFUNDED", isreturnpayment: isreturnpayment } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1, registerpointsperuser: 1 } });
                    var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                    if (getTournamentUser.length > 0) {
                        if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                            var getUserlist = _.map(getTournamentUser, "username");
                            await User.updateMany({ username: { $in: getUserlist } }, { $inc: { hatsonpoints: getTournament.speedytournamentearlypointsregister + getTournament.registerpointsperuser } })
                        } else {
                            var getUserlist = _.map(getTournamentUser, "username");
                            await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.speedytournamentearlypointsregister + getTournament.registerpointsperuser } })
                            /// Create by abhineet
                            var sendList = await User.find({ username: { $in: getUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                            for (let index = 0; index < sendList.length; index++) {
                                const element = sendList[index];
                                IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                            }
                        }
                    }
                }
            } else {
                var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "REFUNDED", isreturnpayment: isreturnpayment } }, { new: true, "fields": { _id: 1, registerpointsperuser: 1 } });
                var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                if (getTournamentUser.length > 0) {
                    if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                        var getUserlist = _.map(getTournamentUser, "username");
                        await User.updateMany({ username: { $in: getUserlist } }, { $inc: { hatsonpoints: getTournament.registerpointsperuser } })
                    } else {
                        var getUserlist = _.map(getTournamentUser, "username");
                        await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.registerpointsperuser } });
                        /// Create by abhineet
                        var sendList = await User.find({ username: { $in: getUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                        for (let index = 0; index < sendList.length; index++) {
                            const element = sendList[index];
                            IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                        }
                    }
                }
            }
        } else if (isplaytournament) {
            //// && status == "ACTIVE" by abhineet update date - 18-01-2022
            // Cut all user amount for Speedy
            if (type == "SPEEDY" && registerstatus == "CONFIRED") {
                var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, isreturnpayment: isreturnpayment  } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1, registerpointsperuser: 1 } });
                var getMinuspoints = getTournament.registerpointsperuser;
                var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
                if (getTournamentUser.length > 0) {
                    if (getTournamentUser[0].adsversionmultiplayerplayonline) {
                        var getUserlist = _.map(getTournamentUser, "username");
                        var getUserListForAvalibleBalance = await User.find({ username: { $in: getUserlist } }).select({ hatsonpoints: 1, username: 1, _id: 0 });
                        var overAvalibleBalance = _.filter(getUserListForAvalibleBalance, ({ hatsonpoints }) => hatsonpoints >= getMinuspoints)
                        var getAvalibleUserlist = _.map(overAvalibleBalance, "username");
                        console.log(getAvalibleUserlist)
                        await Tournamentuser.updateMany({ username: { $in: getAvalibleUserlist } }, { $set: { fullyconfirmedtournamentuser: true } });
                        await User.updateMany({ username: { $in: getAvalibleUserlist } }, { $inc: { hatsonpoints: -getMinuspoints } })

                    } else {
                        // Minus Resolve
                        var getUserlist = _.map(getTournamentUser, "username");
                        var getUserListForAvalibleBalance = await User.find({ username: { $in: getUserlist } }).select({ currentbalanceofpoints: 1, username: 1, _id: 0 });
                        var overAvalibleBalance = _.filter(getUserListForAvalibleBalance, ({ currentbalanceofpoints }) => currentbalanceofpoints >= getMinuspoints)
                        var getAvalibleUserlist = _.map(overAvalibleBalance, "username");
                        console.log(getAvalibleUserlist)
                        await Tournamentuser.updateMany({ username: { $in: getAvalibleUserlist } }, { $set: { fullyconfirmedtournamentuser: true } });
                        await User.updateMany({ username: { $in: getAvalibleUserlist } }, { $inc: { currentbalanceofpoints: -getMinuspoints } })

                        /// Create by abhineet
                        var sendList = await User.find({ username: { $in: getAvalibleUserlist } }, { currentbalanceofpoints: 1, connectionid: 1 })
                        for (let index = 0; index < sendList.length; index++) {
                            const element = sendList[index];
                            IO.to(element.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: element.currentbalanceofpoints });
                        }
                    }
                }
            }
        }
        return {
            status: true
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// Update User Complete or 
// async function oneUpdateAll(params) {
//     try {
//         const { id, isreturnpayment, type, registerstatus, isplaytournament, status } = params;
//         // && status == "ACTIVE"
//         if (isreturnpayment && !isplaytournament) {
//             // all user repayment 
//             if (type == "SPEEDY") {
//                 var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "CANCEL" } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1, speedytournamentearlypointsregister: 1 } });
//                 var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
//                 var getUserlist = _.map(getTournamentUser, "username");
//                 await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.speedytournamentearlypointsregister + getTournament.speedytournamentearlypointsregister} })
//             } else {
//                 var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus, status: "CANCEL" } }, { new: true, "fields": { _id: 1, registerpointsperuser: 1, speedytournamentearlypointsregister: 1 } });
//                 var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
//                 var getUserlist = _.map(getTournamentUser, "username");
//                 await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: getTournament.registerpointsperuser + getTournament.speedytournamentearlypointsregister} });
//             }
//         } 
//         // && status == "ACTIVE"
//         else if (isplaytournament) {
//             // Cut all user amount
//             if (type == "SPEEDY" && registerstatus == "CONFIRED") {
//                 var getTournament = await Tournament.findByIdAndUpdate(id, { $set: { registerstatus: registerstatus } }, { new: true, "fields": { _id: 1, speedytournamentearlypointsregister: 1, registerpointsperuser: 1 } });
//                 var getMinuspoints = getTournament.registerpointsperuser; // - getTournament.speedytournamentearlypointsregister;
//                 var getTournamentUser = await Tournamentuser.find({ tournamentid: id }, { username: 1, _id: 0 });
//                 var getUserlist = _.map(getTournamentUser, "username");
//                 await User.updateMany({ username: { $in: getUserlist } }, { $inc: { currentbalanceofpoints: -getMinuspoints } })
//             }
//         }
//         return {
//             status: true
//         }
//     } catch (error) {
//         return {
//             status: false,
//             msg: "DB Error."
//         };
//     }
// }
module.exports = { getAll, insertOne, getUpdateOne, oneDelete, insertRoundOne, oneRoundDelete, oneRoundUpdate, oneUpdateAll };