module.exports.createPost =  (req, res, next) => { 
    // Validate data
    if(!req.body.title){
        req.flash("error", "Vui lòng nhập tiêu đề");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }
    // End Validate data
    next();
}

module.exports.editPost =  (req, res, next) => { 
    // Validate data
    if(!req.body.title){
        req.flash("error", "Vui lòng nhập tiêu đề");
        backURL=req.header('Referer') || '/';
        // do your thang
        res.redirect(backURL);
        return;
    }
    // End Validate data
    next();
}