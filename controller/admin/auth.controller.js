const Account = require('../../model/account.model');
const md5 = require("md5");

//[GET] /admin/auth/login
module.exports.login = async (req, res) => {
    const user = await Account.findOne({token: req.cookies.token});

    if(req.cookies.token && user){
        res.redirect("/admin/dashboard");
    }
    else{
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập"
        });
    }
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    })
    if(!user){
        req.flash('error', `Email không tồn tại!`);
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    if(md5(password) != user.password){
        req.flash('error', `Sai mật khẩu!`);
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    if(user.active == "inactive"){
        req.flash('error', `Tài khoản đã bị khóa!`);
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }
    res.cookie("token", user.token);
    res.redirect("/admin/dashboard");
}

//[GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin/auth/login");
}