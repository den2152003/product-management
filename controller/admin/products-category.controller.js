const mongoose = require("mongoose");
const ProductCategory = require("../../model/product-category.model");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const createTreeHelper = require("../../helper/createTree");

//[GET]/admin/products-category
module.exports.index = async (req, res) => {
    filterStatus = filterStatusHelper(req.query);

    let find = {
        delete: false
    };



    if (req.query.active)
        find.active = req.query.active;

    const objectSearch = searchHelper(req.query);

    if (objectSearch.reg) {
        find.title = objectSearch.reg;
    }

    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort = {};
    }

    const records = await ProductCategory.find(find).sort(sort);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Trang danh sách danh mục",
        filterStatus: filterStatus,
        records: newRecords
    });
}

//[GET]/admin/products-category/create
module.exports.create = async (req, res) => {
    const find = {
        delete: false,
    };

    

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}

module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const records = new ProductCategory(req.body);
    await records.save();

    res.redirect("/admin/products-category");
}


//[GET]/admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    console.log(req.params.id);
    try {
        const find = {
            delete: false,
            _id: req.params.id
        };

        const records = await ProductCategory.findOne(find);

        res.render("admin/pages/products-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục",
            records: records
        });
    } catch (error) {
        res.redirect("/admin/products-category");
    }
}

module.exports.editPatch = async (req, res) => {
    try {
        await ProductCategory.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", `Cập nhật thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật thất bại!`);
    }


    res.redirect("/admin/products-category");
}