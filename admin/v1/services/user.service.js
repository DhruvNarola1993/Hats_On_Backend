var User = require("./../../../api/v1/models/user.model");
var Level = require("./../../../api/v1/models/level.model");
// All Data
async function getAll(params) {
  try {
    const { pageIndex, pageSize, sortKey, sortOrder, search } = params;
    var documentSkip = parseInt(pageIndex) * parseInt(pageSize);
    var documentLimit = parseInt(pageSize);
    var countTotal = 0;
    var sortorder = sortOrder == "desc" ? -1 : 1; // Server Get Point Order asc or desc
    var sortkey = sortKey;
    var sortObject = {};
    sortObject[sortkey] = sortorder;
    var findAll;
    if (search != "") {
      countTotal = await User.countDocuments({
        $and: [{ $or: [{ username: { $regex: search, $options: "i" } }, { mobile: { $regex: search, $options: "i" } }] }, { isverify: true }]
      });
      findAll = await User.aggregate()
        .match({ $and: [{ $or: [{ username: { $regex: search, $options: "i" } }, { mobile: { $regex: search, $options: "i" } }] }, { isverify: true }] })
        .project({
          _id: 1,
          mobile: 1,
          userlevelid: 1,
          username: 1,
          coin: 1,
          hatsonpoints: 1,
          currentbalanceofpoints: 1,
          registerdate: 1,
          usercode: 1,
          isactive: 1,
          isuserstartype: 1,
          isreferralbenefitactive: 1,
          referencestarcode: 1
        })
        .lookup({
          from: "levels",
          localField: "userlevelid",
          foreignField: "_id",
          as: "userlevel",
        })
        .sort(sortObject)
        .skip(documentSkip)
        .limit(documentLimit);
    } else {
      countTotal = await User.countDocuments({ isverify: true });
      findAll = await User.aggregate()
        .match({ isverify: true })
        .project({
          _id: 1,
          mobile: 1,
          userlevelid: 1,
          username: 1,
          coin: 1,
          hatsonpoints: 1,
          currentbalanceofpoints: 1,
          registerdate: 1,
          usercode: 1,
          isactive: 1,
          isuserstartype: 1,
          isreferralbenefitactive: 1,
          referencestarcode: 1
        })
        .lookup({
          from: "levels",
          localField: "userlevelid",
          foreignField: "_id",
          as: "userlevel",
        })
        .sort(sortObject)
        .skip(documentSkip)
        .limit(documentLimit);
    }

    if (findAll.length > 0) {
      return {
        status: true,
        data: {
          dataSource: findAll,
          length: countTotal,
        },
      };
    } else {
      return {
        status: false,
        msg: "User is not present.",
      };
    }
  } catch (error) {
    return {
      status: false,
      msg: "DB Error.",
    };
  }
}
// Update data
async function updateOneForLevelRating(params) {
  try {
    const {
      userlevelid,
      mobile,
      usercode,
      oldusercode,
      isuserstartype,
      isreferralbenefitactive,
      isactive,
      coin,
      hatsonpoints,
      currentbalanceofpoints,
      referencestarcode,
    } = params;
    var getRating;
    var findAll;
    var countUsercode = await User.countDocuments({ usercode: usercode });
    if (userlevelid != null) {
      getRating = await Level.findById(userlevelid).select({
        _id: 0,
        ratingid: 1,
      });
      var setRating = getRating.ratingid;
      if (countUsercode == 0) {
        findAll = await User.findOneAndUpdate(
          { mobile: mobile },
          {
            $set: {
              usercode: usercode,
              userlevelid: userlevelid,
              isuserstartype: isuserstartype,
              isreferralbenefitactive: isreferralbenefitactive,
              isactive: isactive,
              coin: coin,
              hatsonpoints: hatsonpoints,
              currentbalanceofpoints: currentbalanceofpoints,
              useratingid: setRating,
              referencestarcode: referencestarcode,
            },
          },
          { new: true, fields: { mobile: 1, currentbalanceofpoints: 1, connectionid: 1, online: 1 } }
        );
        // if (findAll.online) {
          IO.to(findAll.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: findAll.currentbalanceofpoints });
        // }
      } else {
        if (usercode != oldusercode && countUsercode == 1) {
          findAll = null;
        } else {
          findAll = await User.findOneAndUpdate(
            { mobile: mobile },
            {
              $set: {
                userlevelid: userlevelid,
                isuserstartype: isuserstartype,
                isreferralbenefitactive: isreferralbenefitactive,
                isactive: isactive,
                coin: coin,
                hatsonpoints: hatsonpoints,
                currentbalanceofpoints: currentbalanceofpoints,
                useratingid: setRating,
                referencestarcode: referencestarcode
              },
            },
            { new: true, fields: { mobile: 1, currentbalanceofpoints: 1, connectionid: 1, online: 1 } }
          );
          // if (findAll.online) {
            IO.to(findAll.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: findAll.currentbalanceofpoints });
          // }
        }
      }
    } else {
      if (countUsercode == 0) {
        findAll = await User.findOneAndUpdate(
          { mobile: mobile },
          {
            $set: {
              usercode: usercode,
              userlevelid: null,
              useratingid: null,
              isuserstartype: isuserstartype,
              isreferralbenefitactive: isreferralbenefitactive,
              isactive: isactive,
              coin: coin,
              hatsonpoints: hatsonpoints,
              currentbalanceofpoints: currentbalanceofpoints,
              referencestarcode: referencestarcode
            },
          },
          { new: true, fields: { mobile: 1, currentbalanceofpoints: 1, connectionid: 1, online: 1 } }
        );
        // if (findAll.online) {
          IO.to(findAll.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: findAll.currentbalanceofpoints });
        // }
      } else {
        if (usercode != oldusercode && countUsercode == 1) {
          findAll = null;
        } else {
          findAll = await User.findOneAndUpdate(
            { mobile: mobile },
            {
              $set: {
                userlevelid: null,
                useratingid: null,
                isuserstartype: isuserstartype,
                isreferralbenefitactive: isreferralbenefitactive,
                isactive: isactive,
                coin: coin,
                hatsonpoints: hatsonpoints,
                currentbalanceofpoints: currentbalanceofpoints,
                referencestarcode: referencestarcode
              },
            },
            { new: true, fields: { mobile: 1, currentbalanceofpoints: 1, connectionid: 1, online: 1 } }
          );

          // if (findAll.online) {
            IO.to(findAll.connectionid).emit('res:currentbalanceofpoints', { status: true, currentbalanceofpoints: findAll.currentbalanceofpoints });
          // }
        }
      }
    }
    if (findAll != null) {
      return {
        status: true,
        data: findAll,
      };
    } else {
      return {
        status: false,
        msg: "User Code is used to other user.",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      msg: "DB Error.",
    };
  }
}
module.exports = { getAll, updateOneForLevelRating };
