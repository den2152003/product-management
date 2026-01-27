const express = require("express");
const multer = require('multer');
const controller = require("../../controller/admin/accounts.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
const upload = multer();
const validate = require("../../validates/admin/account.validate");


const router = express.Router();

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create', 
    upload.single("avatar"), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
); // dùng multer để tải ảnh

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id', 
    upload.single("avatar"), 
    uploadCloud.upload,
    validate.editPost,
    controller.editPatch
);

router.patch('/change-status/:status/:id', controller.changeStatus);

module.exports = router;