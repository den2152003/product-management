const express = require("express");
const multer = require('multer');

const controller = require("../../controller/admin/my-account.controller");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const router = express.Router();

router.get('/', controller.index);

router.get('/edit', controller.edit);

router.patch(
    '/edit', 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    // validate.createPost,
    controller.editPatch
);


module.exports = router;