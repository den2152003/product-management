const Account = require('../../model/account.model');

const md5 = require("md5");

//[GET] /admin/auth/login
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Đăng nhập"
    });
}

module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Thêm mới sản phẩm",
    });
}

module.exports.editPatch = async (req, res) => { 
    const id = res.locals.user._id;
    
    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    });

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    }
    else{
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }

        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", `Cập nhật thành công !`);

        res.redirect("/admin/my-account");
        return;
    }
    // // if(req.file){
    // //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // // }
    backURL=req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);

}