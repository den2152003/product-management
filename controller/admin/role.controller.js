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