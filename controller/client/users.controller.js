// users.controller.js
const User = require("../../model/user.model");

const usersSocket = require("../../sockets/client/users.socket");

module.exports.notFriend = async (req, res) => {
  // Lấy tất cả người dùng (có thể loại trừ chính bản thân người đang đăng nhập)
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId
  });

  const requestFriends = myUser.requestFriends;

  const friendsListIds = myUser.friendsList.map(item => item.user_id);

  const acceptFriends = myUser.acceptFriends;


  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: friendsListIds } },
      { _id: { $nin: acceptFriends } }
    ],
    status: "active",
    deleted: false
  });

  usersSocket(res);

  res.render("client/pages/userss/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};

module.exports.request = async (req, res) => {
  // Lấy tất cả người dùng (có thể loại trừ chính bản thân người đang đăng nhập)
  const userId = res.locals.user.id;

  usersSocket(res);

  const myUser = await User.findOne({
    _id: userId
  });

  const requestFriends = myUser.requestFriends;


  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id:  requestFriends  }
    ],
    status: "active",
    deleted: false
  });

  res.render("client/pages/userss/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};

module.exports.accept = async (req, res) => {
  // Lấy tất cả người dùng (có thể loại trừ chính bản thân người đang đăng nhập)
  const userId = res.locals.user.id;

  usersSocket(res);
  
  const myUser = await User.findOne({
    _id: userId
  });

  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id:  acceptFriends  }
    ],
    status: "active",
    deleted: false
  });

  res.render("client/pages/userss/accept", {
    pageTitle: "Lời mời kết bạn",
    users: users
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const myUserId = res.locals.user.id;

  usersSocket(res);

  // 1. Tìm chính mình để lấy danh sách friendsList
  const myUser = await User.findOne({
    _id: myUserId
  });

  // friendsList thường là mảng object: [{user_id: '...', room_chat_id: '...'}]
  const friendsList = myUser.friendsList;
  const friendsListIds = friendsList.map(item => item.user_id);

  // 2. Tìm danh sách User dựa trên mảng IDs đó
  const users = await User.find({
    _id: { $in: friendsListIds },
    status: "active",
    deleted: false
  }); // Thêm statusOnline để hiện chấm xanh/đỏ

  // 3. (Optional) Gán room_chat_id vào từng user để client dễ xử lý nút "Nhắn tin"
  users.forEach(user => {
    const infoFriend = friendsList.find(item => item.user_id == user.id);
    user.roomChatId = infoFriend.room_chat_id;
  });

  res.render("client/pages/userss/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};