var commonValidator = require('../common/common.validator');
const { computerplayEnterplay, computerplayWinplayer, computerplayAdsCoin } = require('../services/computerplay.service');

async function computerversionentergame(payload) {
    try {
        const { username, coin } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        var errorMsgCoin = await commonValidator.isNumber(coin);
        if (errorMsgUserid.status && errorMsgCoin.status) {
            var errorService = await computerplayEnterplay(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
            else if(!errorMsgCoin.status)
                return errorMsgCoin;    
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

async function computerversionwingame(payload) {
    try {
        const { username, coin } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        var errorMsgCoin = await commonValidator.isNumber(coin);
        if (errorMsgUserid.status && errorMsgCoin.status) {
            var errorService = await computerplayWinplayer(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
            else if(!errorMsgCoin.status)
                return errorMsgCoin;    
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


async function computerversionadscoin(payload) {
    try {
        const { username, coin } = payload;
        var errorMsgUserid = await commonValidator.notEmptyAndNull(username);
        var errorMsgCoin = await commonValidator.isNumber(coin);
        if (errorMsgUserid.status && errorMsgCoin.status) {
            var errorService = await computerplayAdsCoin(payload);
            return errorService;
        } else {
            if (!errorMsgUserid.status)
                return errorMsgUserid;
            else if(!errorMsgCoin.status)
                return errorMsgCoin;    
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

module.exports = { computerversionentergame, computerversionwingame, computerversionadscoin };
