const mongoose = require("mongoose");
const ProductCategory = require("../../model/product-category.model");
const Account = require("../../model/account.model");
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

    for(const record of records){
        const user = await Account.findOne({_id: record.createdBy.account_id});
        if(user)
            record.accountFullName = user.fullName;
    }

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

    req.body.createdBy = {
        account_id: res.locals.user._id
    };

    const records = new ProductCategory(req.body);
    await records.save();

    req.flash("success", `Thêm mới danh mục thành công!`);
    res.redirect("/admin/products-category");
}


//[GET]/admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            delete: false,
            _id: req.params.id
        };

        const data = await ProductCategory.findOne(find);

        const records = await ProductCategory.find({delete:false});

        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-category/edit.pug", {
            pageTitle: "Chỉnh sửa danh mục",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect("/admin/products-category");
    }
}

module.exports.editPatch = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    try {
        await ProductCategory.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", `Cập nhật thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật thất bại!`);
    }

    res.redirect("/admin/products-category");

}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            delete: false,
            _id: req.params.id
        };

        const records = await ProductCategory.findOne(find);

        res.render("admin/pages/products-category/detail.pug", {
            pageTitle: records.title,
            records: records
        });
    } catch (error) {
        res.redirect("/admin/products");
    }

}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { active: "active" });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { active: "inactive" });
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            await ProductCategory.updateMany(
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

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne(
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

//[PATCH] /admin/products-category/change-status/:active/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { active: status });

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');

    backURL = req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);

}