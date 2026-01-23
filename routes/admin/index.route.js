const productsRoutes = require("./product.route");
const dashboardRoutes = require("./dashboard.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");

const userMiddleWare = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
    app.use(userMiddleWare.infoUser);

    app.use('/admin/dashboard' , dashboardRoutes);
    
    app.use('/admin/products' , productsRoutes);

    app.use('/admin/products-category' , productsCategoryRoutes);

    app.use('/admin/roles' , rolesRoutes);

    app.use('/admin/accounts' , accountsRoutes);

};