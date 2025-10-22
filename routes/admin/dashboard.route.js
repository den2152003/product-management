const express = require("express");
const controller = require("../../controller/admin/dashboard.controller")

const router = express.Router();   
    
router.get('/', controller.dashboard);

module.exports = router;