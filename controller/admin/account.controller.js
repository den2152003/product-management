const Account = require('../../model/account.model');
const md5 = require("md5");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted:false
    }
    const records = await Account.find(find).select("-password -token");

    console.log(records);
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => { 
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản"
    });
}

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => { 

    const emailExits = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    if(emailExits){
        req.flash("error", `Email đã tồn tại!`);
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
    }
    else{
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();
        
        res.redirect("/admin/accounts");
    }


}

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => { 
    console.log(req.params.id);
    
    const find = {
            deleted: false,
            _id: req.params.id
    };
    try {
        
        const records = await Account.findOne(find);

        res.render("admin/pages/accounts/edit.pug", {
            pageTitle: "Chỉnh sửa tài khoản",
            records: records
    });
    } catch (error) {
        res.redirect("/admin/accounts");
    }
}

module.exports.editPatch = async (req, res) => { 

    // console.log(req.body.email);
    const id = req.params.id;
    
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

        res.redirect("/admin/accounts");
        return;
    }
    // // if(req.file){
    // //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // // }
    backURL=req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);

}