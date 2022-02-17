var TournamentUser = require('./../../../api/v1/models/tournamentuser.model');
var _ = require("lodash");
// All Data 
async function getAll(params) {
    try {
        const { pageIndex, pageSize, sortKey, sortOrder, tournamentid } = params;
        var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
        var documentLimit = parseInt(pageSize);
        var countTotal = 0;
        var sortorder = sortOrder == "desc" ? -1 : 1; // Server Get Point Order asc or desc  
        var sortkey = sortKey;
        var sortObject = {};
        sortObject[sortkey] = sortorder;
        var findAll;
        countTotal = await TournamentUser.countDocuments({ tournamentid: tournamentid });
        findAll = await TournamentUser.find({ tournamentid: tournamentid }).sort(sortObject).skip(documentSkip).limit(documentLimit).lean();
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
                msg: "Tournament User is not present."
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { getAll };