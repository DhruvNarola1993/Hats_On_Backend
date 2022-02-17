var Rating = require('../../../api/v1/models/rating.model');
var Level = require('../../../api/v1/models/level.model');
const Tournament = require('../../../api/v1/models/tournament.model');
const User = require('../../../api/v1/models/user.model');
const Subcription = require('../../../api/v1/models/subscription.model');
const Promo = require('../../../api/v1/models/promo.code.model');
var moment = require("moment");
// Level Get
async function getLevelCombo() {
    try {
        var findOne = await Level.find().select({ name: 1 }).lean();
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Level is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Rating Get
async function getRatingCombo() {
    try {
        var findOne = await Rating.find().select({ name: 1 }).lean();
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Rating is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

// Tournament Get
async function getTournamentCombo() {
    try {
        var findOne = await Tournament.find().select({ name: 1 }).lean();
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

// Tournament Get
async function getStarUserCombo() {
    try {
        var findOne = await User.find({ isuserstartype: 1 }).select({ usercode: 1 }).lean();
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "User is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


// Subscription Get 
async function getSubcribeCombo() {
    try {
        var findOne = await Subcription.find({ isactive: 1 }).lean();
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Subcription is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


// Point Get
async function getPointCombo() {
    try {
        var findOne = await Level.distinct("point");
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Point is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}



// Star Panel Get
async function getStarUserListCombo() {
    try {
        var findOne = await User.find({ isuserstartype: true }, { usercode: 1 });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Star User Panel is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}


// Promo Code Get
async function getPromoCode() {
    try {
        var currentDate = moment(new Date());
        var findOne = await Promo.find({ enddate: { $lte: currentDate } });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Promo Code is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}

module.exports = { getLevelCombo, getRatingCombo, getTournamentCombo, getStarUserCombo, getSubcribeCombo, getPointCombo, getStarUserListCombo, getPromoCode };