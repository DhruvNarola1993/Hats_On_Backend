var Contact = require('./../../../api/v1/models/contactus.model');
// Contact All Data 
async function getAll(params) {
    try {
        const { pageIndex, pageSize } = params;
        var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
        var documentLimit = parseInt(pageSize);
        var countTotal = await Contact.countDocuments();
        var findAll = await Contact.find().skip(documentSkip).limit(documentLimit).sort({ _id: 1 }).lean();
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
                msg: "Contact is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { getAll };