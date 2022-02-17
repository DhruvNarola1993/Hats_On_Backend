var { notEmptyAndNull } = require('./../common/common.validator');
var profileService = require('./../services/file.services');
// Update cart File
async function updatethemefile(params) {
    try {
        // name, themeurl, isPrivate
        const { username, imageurl } = params;
        var errorName = await notEmptyAndNull(username);
        var errorThemeurl = await notEmptyAndNull(imageurl);
        if (errorName.status && errorThemeurl.status) {
            errorValidator = await profileService.oneUpdateFile(params);
            return errorValidator;
        } else {
            if (!errorName.status)
                return errorName;
            else if (!errorThemeurl.status)
                return errorThemeurl;
        }
    } catch (error) {
        return {
            status: false,
            msg: "Helper Error."
        };
    }
}
module.exports = { updatethemefile };