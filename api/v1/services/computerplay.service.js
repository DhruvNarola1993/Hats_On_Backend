var User = require('../models/user.model');

async function computerplayEnterplay(params) {
    try {
        const { username, coin } = params;
        var computerplayupdateCoin = await User.findOneAndUpdate({ username: username }, {
            $inc: {
                "coin": -parseInt(coin),
                "computerplaygame": 1
            }
        }, { new: true, "fields": { "coin": 1, _id: 0 } });
        if (computerplayupdateCoin != undefined) {
            return {
                status: true,
                hcoin: computerplayupdateCoin.coin
            };
        } else {
            return {
                status: false,
                msg: "Play with Bot. Something went wrong. Please try again.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function computerplayWinplayer(params) {
    try {
        const { username, win, coin } = params;
        var setCoin = coin;
        var gameWin = 1;
        if ((win == false) || (win == "false")) {
            setCoin = - parseInt(setCoin);
            gameWin = 0;
        }
        var computerplayerupdateCoin = await User.findOneAndUpdate({ username: username }, {
            $inc: {
                "coin": parseInt(setCoin),
                "computerwin": parseInt(gameWin),
                "totalcoin": parseInt(setCoin)
            }
        }, { new: true, "fields": { "coin": 1, _id: 0 } });
        if (computerplayerupdateCoin != undefined) {
            return {
                status: true,
                hcoin: computerplayerupdateCoin.coin,
                win: win
            };
        } else {
            return {
                status: false,
                msg: "Play with Bot. Win data could not be updated.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function computerplayAdsCoin(params) {
    try {
        const { username, coin } = params;
        var computerplayerupdateCoin = await User.findOneAndUpdate({ username: username }, {
            $inc: {
                "coin": parseInt(coin),
                "totalcoin": parseInt(coin)
            }
        }, { new: true, "fields": { "coin": 1, _id: 0 } });
        if (computerplayerupdateCoin != undefined) {
            return {
                status: true,
                hcoin: computerplayerupdateCoin.coin
            };
        } else {
            return {
                status: false,
                msg: "Computer Version Coin is not updated.",
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { computerplayEnterplay, computerplayWinplayer, computerplayAdsCoin };