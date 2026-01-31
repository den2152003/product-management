const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    title: String, // Với chat 2 người, title có thể để trống hoặc tên 2 người
    typeGroup: {
      type: String,
      default: "friend" // "friend" là chat 2 người, "group" là nhóm
    },
    users: [
      {
        user_id: String,
        role: String
      }
    ],
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");
module.exports = RoomChat;