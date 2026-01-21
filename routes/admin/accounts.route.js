const express = require("express");
const controller = require("../../controller/admin/accounts.controller");

const router = express.Router();

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', controller.editPatch);

module.exports = router;