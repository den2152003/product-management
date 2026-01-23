const express = require("express");
const controller = require("../../controller/admin/role.controller");

const router = express.Router();   
    
router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

router.get('/edit/:_id', controller.edit);

router.patch('/edit/:_id', controller.editPatch);

module.exports = router;