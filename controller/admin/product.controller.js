const mongoose = require("mongoose");
const Product = require("../../model/product.model");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");


//[GET]/admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.active);

    // Helper lọc
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

    let objectPagination = {
        currentPage: 1,
        limitItem: 4
    };

    const countProduct = await Product.countDocuments(find);

    paginationHelper(objectPagination, req.query, countProduct);

    let sort = {};

    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort = {};
    }

    const products =  await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
    // end pagination



    res.render("admin/pages/product/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[PATCH] /admin/product/change-status/:active/:id
module.exports.changStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: req.params.id }, { active: req.params.status });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');

    backURL = req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);

}

//[PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { active: "active" });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { active: "inactive" });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    delete: true,
                    deletedAt: new Date()
                });
            break;
    }

    backURL = req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);
}

//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        { _id: id },
        {
            delete: true,
            deletedAt: new Date()
        }
    );
    req.flash("success", "Đã xóa sản phẩm thành công");
    backURL = req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);
}

//[GET] admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
}
//[POST] admin/products/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect("/admin/products");

}

module.exports.edit = async (req, res) => {
    console.log(req.params.id);
    try {
        const find = {
            delete: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/product/edit.pug", {
            pageTitle: "Thêm mới sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect("/admin/products");
    }
}

module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);


   

    try {
        await Product.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", `Cập nhật thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật thất bại!`);
    }


    res.redirect("/admin/products");
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            delete: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/product/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect("/admin/products");
    }

}