const SettingsGeneral = require("../../model/settings-general.model");

//[GET]/admin/roles
module.exports.general = async (req, res) => {
    const settingsGeneral = await SettingsGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingsGeneral: settingsGeneral
    });
}

module.exports.generalPatch = async (req, res) => {
    const settingsGeneral = await SettingsGeneral.findOne({});
    if(settingsGeneral){
        await SettingsGeneral.updateOne({_id: settingsGeneral._id}, req.body);
    } else {
        const record = new SettingsGeneral(req.body);
        await record.save()
    }
    
    req.flash("success", "Cập nhật thành công");
    backURL = req.header('Referer') || '/';
    // do your thang
    res.redirect(backURL);
}