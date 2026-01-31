const RoomChat = require("../../model/rooms-chat.model");
const User = require("../../model/user.model");


module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;

    // Chỉ lấy những phòng có typeGroup là "group"
    const listRoomChat = await RoomChat.find({
        "users.user_id": userId,
        typeGroup: "group", 
        deleted: false
    }).sort({ updatedAt: -1 });

    listRoomChat.forEach(room => {
        if (!room.avatar) {
            room.avatar = "/images/group-default.png";
        }
    });

    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Danh sách nhóm chat",
        listRoomChat: listRoomChat
    });
};

module.exports.create = async (req, res) => {
  const userId = res.locals.user.id;
  
  // Lấy danh sách bạn bè để chọn
  const user = await User.findOne({ _id: userId });
  const friendsList = user.friendsList;

  for (const friend of friendsList) {
    const infoFriend = await User.findOne({ _id: friend.user_id }).select("fullName");
    friend.fullName = infoFriend.fullName;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng chat",
    friends: friendsList
  });
};


// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const userId = res.locals.user.id;
  
  // Lấy danh sách bạn bè để chọn
  const user = await User.findOne({ _id: userId });
  const friendsList = user.friendsList;

  for (const friend of friendsList) {
    const infoFriend = await User.findOne({ _id: friend.user_id }).select("fullName");
    friend.fullName = infoFriend.fullName;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng chat",
    friends: friendsList
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId; // Đây là mảng các ID bạn bè được tích chọn
  const myUserId = res.locals.user.id;

  const dataRoom = {
    title: title,
    typeGroup: "group",
    users: []
  };

  // Thêm người tạo phòng làm Quản trị viên
  dataRoom.users.push({
    user_id: myUserId,
    role: "superAdmin"
  });

  // Thêm các thành viên khác
  if (Array.isArray(usersId)) {
    usersId.forEach(id => {
      dataRoom.users.push({
        user_id: id,
        role: "user"
      });
    });
  } else if (usersId) { // Trường hợp chỉ chọn 1 người thì usersId là String
    dataRoom.users.push({
      user_id: usersId,
      role: "user"
    });
  }

  const room = new RoomChat(dataRoom);
  await room.save();

  res.redirect(`/chat/${room.id}`);
};