const dashboardRoutes = require("./dashboard.route");
const productdRoutes = require("./product.route");

module.exports = (app) => {
    app.use('/admin/dashboard', dashboardRoutes);
    app.use('/admin/products', productdRoutes);
};