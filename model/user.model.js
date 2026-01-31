const mongoose = require("mongoose");
const generate = require("../helper/generate");
const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20),
        },
        phone: String,
        avatar: String,
        friendsList: [
            {
                user_id: String,
                room_chat_id: String
            }
        ],
        acceptFriends: Array,
        requestFriends: Array,
        status: {
            type: String,
            default: "active"
        },
        statusOnline: {
            type: String,
            default: "offline"
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;