const { notEmptyAndNull } = require("../common/common.validator");
const { listAllTournament, registerTournament, roundTournament, playroundTournament, exitroundTournament, winroundTournament, exitroundafterplayroundTournament } = require("../services/tournament.common.service");

/// Tournament List
async function tournamentlistValidator(payload) {
    try {
        // mobile, key, value
        const { type, username } = payload;
        var errorMsgType = await notEmptyAndNull(type);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await listAllTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Tournament Register 
async function tournamentregisterValidator(payload) {
    try {
        // username, tournamentid, 
        const { tournamenttype, username } = payload;
        var errorMsgType = await notEmptyAndNull(tournamenttype);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await registerTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Tournament Round 
async function tournamentroundValidator(payload) {
    try {
        // username, tournamentid, 
        const { tournamenttype, username } = payload;
        var errorMsgType = await notEmptyAndNull(tournamenttype);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await roundTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Tournament Play Round  
async function tournamentplayroundValidator(payload) {
    try {
        // username, tournamentid, 
        const { tournamenttype, username } = payload;
        var errorMsgType = await notEmptyAndNull(tournamenttype);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await playroundTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Tournament Exit Round  
async function tournamentexitroundValidator(payload) {
    try {
        // username, tournamentid, 
        const { tournamenttype, username } = payload;
        var errorMsgType = await notEmptyAndNull(tournamenttype);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await exitroundTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Tournament Win Round
async function tournamentwinroundValidator(payload) {
    try {
        // username, tournamentid, 
        const { tournamenttype, username } = payload;
        var errorMsgType = await notEmptyAndNull(tournamenttype);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await winroundTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}

/// Tournament Round Exit Game After Round Play
async function tournamentexitroundafterplayroundValidator(payload) {
    try {
        // username, tournamentid, 
        const { tournamenttype, username } = payload;
        var errorMsgType = await notEmptyAndNull(tournamenttype);
        var errorMsgUsername = await notEmptyAndNull(username);
        if (errorMsgType.status && errorMsgUsername.status) {
            var errMsg = await exitroundafterplayroundTournament(payload);
            return errMsg;
        } else {
            if (!errorMsgType.status)
                return errorMsgType;
            else if (!errorMsgUsername.status)
                return errorMsgUsername;
        }
    } catch (error) {
        return {
            status: false,
            msg: error
        };
    }
}


module.exports = { tournamentlistValidator, tournamentregisterValidator, tournamentroundValidator, tournamentplayroundValidator, tournamentexitroundValidator, tournamentwinroundValidator, tournamentexitroundafterplayroundValidator };