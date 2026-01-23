const Role = require("../../model/role.model");

//[GET]/admin/roles
module.exports.index = async (req, res) => {
    let find = {
        delete: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
}

//[GET]/admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
}

module.exports.createPost = async (req, res) => {
    const records = new Role(req.body);
    
    await records.save();

    res.redirect("/admin/roles");
}

module.exports.edit = async (req, res) => {
    try {
        const find = {
            delete: false,
            _id: req.params._id
        };

        const data = await Role.findOne(find);

        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect("/admin/roles");
    }
}

module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params._id }, req.body);
        req.flash("success", `Cập nhật thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật thất bại!`);
    }


    res.redirect("/admin/roles");
}