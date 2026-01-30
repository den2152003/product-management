const express = require("express");

const controller = require("../../controller/client/product.controller")

const router = express.Router();   

router.get('/', controller.index);

router.get('/:slugCategory', controller.slugCategory);

router.get('/detail/:slugProduct', controller.detail);

module.exports = router;