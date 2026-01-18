module.exports.loginPost =  (req, res, next) => { 

    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }
    // End Validate data
    next();
}
