const md5 = require("md5");
const User = require('../../model/user.model');
const ForgotPassword = require('../../model/forgot-password.model');
const generateHelper = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMail");


//[GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/users/register", {
        pageTitle: "Đăng ký tài khoản"
    });
}

//[POST] /user/register
module.exports.registerPost = async (req, res) => {

    req.body.password = md5(req.body.password);

    const emailExits = await User.findOne({
        deleted:false,
        email:req.body.email
    })

    if(emailExits){
        req.flash("error", "Email đã tồn tại");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    const user = new User(req.body);

    await user.save();

    console.log(user);

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

//[GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/users/login", {
        pageTitle: "Đăng nhập"
    });
}

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        deleted:false,
        email:req.body.email
    })

    if(!user){
        req.flash("error", "Email không tồn tại");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");

    res.redirect("/");
}

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/users/forgot-password", {
        pageTitle: "Quên mật khẩu"
    });
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        deleted:false,
        email:email
    })

    if(!user){
        req.flash("error", "Email không tồn tại");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    // OTP
    const otp = generateHelper.generateRandomNumber(8);

    const forgotPasswordSchema = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }
    
    console.log(forgotPasswordSchema);

    const forgotPassword = new ForgotPassword(forgotPasswordSchema);

    await forgotPassword.save();
    // End OTP
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là <b>${otp}. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP.
    `;

    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`)
}

//[GET] /user/password/otp?email=
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/users/otp-password", {
        pageTitle: "Đăng nhập",
        email: email
    });
}

//[POST] /user/password/otp?email=
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        req.flash("error", "OTP k hợp lệ");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    const user = await User.findOne({
        email: email
    })

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/users/reset-password", {
        pageTitle: "Đổi mật khẩu"
    });
}

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
        {tokenUser: tokenUser},
        {
            password: md5(password)
        }
    )
    res.redirect("/");
}

//[GET] /user/info
module.exports.info = async (req, res) => {

    res.render("client/pages/users/info", {
        pageTitle: "Đăng ký tài khoản"
    });
}