const Chat = require("../../model/chat.model");
const User = require("../../model/user.model"); // Cần thêm model User để lấy tên

module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomId = req.params.roomId;

    // 1. Xử lý Socket.io
    _io.once("connection", (socket) => {
        socket.join(roomId);
        
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: content,
                room_chat_id: roomId
            });
            await chat.save();

            // Trả về cho tất cả mọi người kèm tên người gửi
            _io.to(roomId).emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

        // Ví dụ logic bên Server
        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
    });

    // 2. Lấy tin nhắn từ DB và "Join" thủ công với User
    const chats = await Chat.find({
        deleted: false,
        room_chat_id: roomId
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.infoUser = infoUser; // Gán thêm thông tin vào object chat để Pug dùng
    }

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats // Gửi danh sách tin nhắn sang giao diện
    });
}