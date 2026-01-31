const RoomChat = require("../../model/rooms-chat.model");

// middleware/chat.middleware.js
module.exports.isAccess = async (req, res, next) => {
    const roomId = req.params.roomId;
    const userId = res.locals.user.id;

    try {
        const room = await RoomChat.findOne({
            _id: roomId,
            "users.user_id": userId, // Kiểm tra xem userId có trong mảng users của phòng không
            deleted: false
        });

        if (room) {
            next(); // Cho phép vào
        } else {
            res.redirect("/"); // Không phải thành viên thì đuổi ra trang chủ
        }
    } catch (error) {
        res.redirect("/"); // Không phải thành viên thì đuổi ra trang chủ
    }

};