var CommonValidator = require('../common/validator');
var TournamentService = require('../services/tournament.services');
// get All
async function gettournament(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
        var errorsortKey = await CommonValidator.notEmptyAndNull(sortKey);
        var errorsortOrder = await CommonValidator.notEmptyAndNull(sortOrder);
        if (errorsortKey.status && errorsortOrder.status) {
            var errorValidator = await TournamentService.getAll(params);
            return errorValidator;
        } else {
            if (!errorsortKey.status)
                return errorsortKey;
            else if (!errorsortOrder.status)
                return errorsortOrder;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Insert 
async function inserttournament(params) {
    try {
        const { name } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(name);
        if (errorQuestion.status) {
            var errorValidator = await TournamentService.insertOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update
async function updatetournament(params) {
    try {
        const { type } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(type);
        if (errorQuestion.status) {
            var errorValidator = await TournamentService.getUpdateOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Update --- Cancle or Data
async function updatetournamentcancle(params) {
    try {
        const { type } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(type);
        if (errorQuestion.status) {
            var errorValidator = await TournamentService.oneUpdateAll(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonetournament(params) {
    try {
        var errorValidator = await TournamentService.oneDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Insert 
async function inserttournamentround(params) {
    try {
        const { roundentrystartdatetime } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(roundentrystartdatetime);
        if (errorQuestion.status) {
            var errorValidator = await TournamentService.insertRoundOne(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}

// Update
async function updatetournamentround(params) {
    try {
        const { roundentrystartdatetime } = params;
        var errorQuestion = await CommonValidator.notEmptyAndNull(roundentrystartdatetime);
        if (errorQuestion.status) {
            var errorValidator = await TournamentService.oneRoundUpdate(params);
            return errorValidator;
        } else {
            if (!errorQuestion.status)
                return errorQuestion;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
// Delete
async function deleteonetournamentround(params) {
    try {
        var errorValidator = await TournamentService.oneRoundDelete(params);
        return errorValidator;
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { gettournament, 
    inserttournament, updatetournament, deleteonetournament, 
    inserttournamentround, updatetournamentround, deleteonetournamentround, updatetournamentcancle };