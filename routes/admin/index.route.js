// const homeRoutes = require("./home.route");
const productsRoutes = require("./product.route");

const userMiddleWare = require("../../middlewares/client/user.middleware");

module.exports = (app) => {
    app.use(userMiddleWare.infoUser);
    
    // app.use('/admin', homeRoutes);

    app.use('/admin/products' , productsRoutes);

    
};