const express = require("express");
const controller = require("../../controller/client/chat.controller")

const chatMiddleWare = require("../../middlewares/client/chat.middleware");

const router = express.Router();   
    
router.get('/:roomId',chatMiddleWare.isAccess, controller.index);

module.exports = router;