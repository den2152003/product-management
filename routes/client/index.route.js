const homeRoutes = require("./home.route");
const productsRoutes = require("./product.route");
const usersRoutes = require("./user.route");

const userMiddleWare = require("../../middlewares/client/user.middleware");
const authMiddleWare = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
    app.use(userMiddleWare.infoUser);
    
    app.use('/', homeRoutes);

    app.use('/products',authMiddleWare.requireAuth , productsRoutes);

    app.use("/user",  usersRoutes);

};