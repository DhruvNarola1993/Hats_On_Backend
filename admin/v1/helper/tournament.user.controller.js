var CommonValidator = require('../common/validator');
var TournamentUserService = require('../services/tournament.user.service');
// get All
async function gettournament(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder } = params;
        var errorsortKey = await CommonValidator.notEmptyAndNull(sortKey);
        var errorsortOrder = await CommonValidator.notEmptyAndNull(sortOrder);
        if (errorsortKey.status && errorsortOrder.status) {
            var errorValidator = await TournamentUserService.getAll(params);
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

module.exports = { gettournament };