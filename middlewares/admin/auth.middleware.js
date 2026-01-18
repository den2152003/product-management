const Account = require("../../model/account.model");

module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token){
        res.redirect("/admin/auth/login");
    }
    else{
        const user = await Account.findOne({token: req.cookies.token});
        if(user){
            next();
        }
        else{
            res.redirect("/admin/auth/login");
        }
    }
}