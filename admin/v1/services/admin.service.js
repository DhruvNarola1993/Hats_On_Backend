var Admin = require('./../../../api/v1/models/admin.model');
// Login
async function insertOne(params) {
    try {
        const { email, password } = params;
        var countAdmin = await Admin.countDocuments();
        if (countAdmin > 0) {
            var findadmin = await Admin.findOne({ email: email }).select({ email: 1, password: 1 });
            if (findadmin != undefined) {
                if (findadmin.password == password) {
                    return {
                        status: true,
                        data: findadmin
                    };
                } else {
                    return {
                        status: false,
                        msg: "Password does not match."
                    };
                }
            } else {
                return {
                    status: false,
                    msg: "Email and password does not match."
                };
            }
        } else {
            var insertAdmin = await new Admin(params);
            insertAdmin.save();
            if (insertAdmin != null) {
                return {
                    status: true,
                    data: insertAdmin
                };
            } else {
                return {
                    status: false,
                    msg: "Email and password does not match."
                };
            }
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
        const { _id, email, password } = params;
        var findOne = await Admin.findByIdAndUpdate(_id, { $set: { email: email, password: password, updatedate: new Date() } }, { new: true });
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Admin is not update."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
// One Data
async function getOne(params) {
    try {
        const { id } = params;
        var findOne = await Admin.findById(id).lean();
        if (findOne != null) {
            return {
                status: true,
                data: findOne
            };
        } else {
            return {
                status: false,
                msg: "Admin is not present."
            };
        }
    } catch (error) {
        return {
            status: false,
            msg: "DB Error."
        };
    }
}
module.exports = { insertOne, getUpdateOne, getOne };