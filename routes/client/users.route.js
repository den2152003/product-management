const express = require("express");

const controller = require("../../controller/client/users.controller");

const router = express.Router();   

router.get('/not-friend', controller.notFriend);

module.exports = router;