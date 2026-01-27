const productsRoutes = require("./product.route");
const dashboardRoutes = require("./dashboard.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");
const authRoutes = require("./auth.route");

const authMiddleWare = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {

    app.use('/admin/dashboard' , authMiddleWare.requireAuth, dashboardRoutes);
    
    app.use('/admin/products' , authMiddleWare.requireAuth,  productsRoutes);

    app.use('/admin/products-category' , authMiddleWare.requireAuth, productsCategoryRoutes);

    app.use('/admin/roles' , authMiddleWare.requireAuth,  rolesRoutes);

    app.use('/admin/accounts' , authMiddleWare.requireAuth, accountsRoutes);

    app.use('/admin/auth' , authRoutes);
};