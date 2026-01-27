const express = require("express");
const controller = require("../../controller/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");

const router = express.Router();

router.get('/login', controller.login);

router.post('/login', validate.loginPost, controller.loginPost);

router.get('/logout', controller.logout);

module.exports = router;