const User = require("../../model/user.model");
const RoomChat = require("../../model/rooms-chat.model");

module.exports = (res) => {
    const myUserId = res.locals.user.id; // ID của chính bạn

    _io.once("connection", (socket) => {
        const updateOnline = async () => {
            await User.updateOne({ _id: myUserId }, { statusOnline: "online" });

            // Thông báo cho bạn bè của User này biết User này đã online
            socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", myUserId);
        };
        updateOnline();

        socket.on("disconnect", async () => {
            await User.updateOne({ _id: myUserId }, { statusOnline: "offline" });

            // Thông báo cho bạn bè của User này biết User này đã offline
            socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", myUserId);
        });

        // Chức năng Kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            // userId: ID của người được nhận lời mời
            // 1. Thêm ID của người đó vào requestFriends của mình
            const existIdInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });
            if (!existIdInA) {
                await User.updateOne({ _id: myUserId }, {
                    $push: { requestFriends: userId }
                });
            }

            // 2. Thêm ID của mình vào acceptFriends của người đó
            const existIdInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });
            if (!existIdInB) {
                await User.updateOne({ _id: userId }, {
                    $push: { acceptFriends: myUserId }
                });
            }

            const infoUserB = await User.findOne({ _id: userId });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            const infoUserA = await User.findOne({
                _id: myUserId
            });

            // 3. Gửi thông tin User A tới User B
            // Sử dụng broadcast (hoặc .to(userId) nếu bạn đã dùng Room)
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId, // ID của người nhận để check bên client
                infoUserA: infoUserA
            });

            socket.broadcast.emit("SERVER_RETURN_USER_ID_NOT_FRIEND", {
                userId: userId, // ID của người nhận (B)
                infoUserA: myUserId  // ID của người gửi (A) - người cần bị xóa khỏi list
            });
        });

        // Chức năng Hủy kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            // 1. Xóa ID người đó khỏi requestFriends của mình
            await User.updateOne({ _id: myUserId }, {
                $pull: { requestFriends: userId }
            });

            // 2. Xóa ID mình khỏi acceptFriends của người đó
            await User.updateOne({ _id: userId }, {
                $pull: { acceptFriends: myUserId }
            });

            const infoUserB = await User.findOne({ _id: userId });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userIdB: userId,     // Để người B biết thông tin này dành cho mình
                userIdA: myUserId    // ID của người A để tìm box và xóa
            });
        });

        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            // userId là ID của người đã gửi lời mời cho bạn

            // 1. Xóa ID của bạn khỏi requestFriends của người kia (người gửi)
            await User.updateOne({ _id: userId }, {
                $pull: { requestFriends: myUserId }
            });

            // 2. Xóa ID người kia khỏi acceptFriends của chính bạn (người nhận)
            await User.updateOne({ _id: myUserId }, {
                $pull: { acceptFriends: userId }
            });

            console.log(`User ${myUserId} đã từ chối lời mời của ${userId}`);
        });

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            // userId: ID của người gửi lời mời (Người B)
            // myUserId: ID của bạn (Người A)
            const dataRoom = {
                typeGroup: "friend",
                users: [
                    { user_id: userId, role: "superAdmin" },
                    { user_id: myUserId, role: "superAdmin" }
                ]
            };

            const roomChat = new RoomChat(dataRoom);
            await roomChat.save();

            // 1. Thêm {user_id, room_chat_id} vào friendsList của cả hai (Nếu bạn có làm chat)
            // 2. Xóa ID trong các mảng chờ

            // Cập nhật cho Người A (Bạn)
            await User.updateOne({ _id: myUserId }, {
                $push: {
                    friendsList: {
                        user_id: userId,
                        room_chat_id: roomChat._id // Sẽ cập nhật khi tạo phòng chat sau
                    }
                },
                $pull: { acceptFriends: userId }
            });

            // Cập nhật cho Người B (Người gửi lời mời)
            await User.updateOne({ _id: userId }, {
                $push: {
                    friendsList: {
                        user_id: myUserId,
                        room_chat_id: roomChat._id
                    }
                },
                $pull: { requestFriends: myUserId }
            });


        });

        socket.on("CLIENT_UNFRIEND", async (userId) => {
            // userId là ID của người mà bạn muốn hủy kết bạn

            // 1. Xóa bạn khỏi friendsList của người kia
            await User.updateOne({ _id: userId }, {
                $pull: {
                    friendsList: {
                        user_id: myUserId
                    }
                }
            });

            // 2. Xóa người kia khỏi friendsList của chính bạn
            await User.updateOne({ _id: myUserId }, {
                $pull: {
                    friendsList: {
                        user_id: userId
                    }
                }
            });

            console.log(`User ${myUserId} và ${userId} đã hủy kết bạn`);
        });

    });
}


