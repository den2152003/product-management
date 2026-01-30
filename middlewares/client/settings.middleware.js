const SettingsGeneral = require("../../model/settings-general.model");

module.exports.settingsGeneral = async (req, res, next) => {
    const settingsGeneral = await SettingsGeneral.findOne({});

    res.locals.settingsGeneral = settingsGeneral;
    
    next();
}