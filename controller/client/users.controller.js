// users.controller.js
const User = require("../../model/user.model");

module.exports.notFriend = async (req, res) => {
  // Lấy tất cả người dùng (có thể loại trừ chính bản thân người đang đăng nhập)
  const users = await User.find({
    status: "active",
    _id: { $ne: res.locals.user._id }, // Loại trừ bản thân
    deleted:false
  });

  res.render("client/pages/userss/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};