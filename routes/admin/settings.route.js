const express = require("express");
const multer = require('multer');

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
const controller = require("../../controller/admin/settings.controller");

const router = express.Router();   
    
router.get('/general', controller.general);

router.patch('/general',
    upload.single("logo"), 
    uploadCloud.upload, 
    controller.generalPatch);

module.exports = router;