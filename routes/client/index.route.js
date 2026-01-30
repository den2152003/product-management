const homeRoutes = require("./home.route");
const productsRoutes = require("./product.route");
const userRoutes = require("./user.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");

const userMiddleWare = require("../../middlewares/client/user.middleware");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
const settingsMiddleWare = require("../../middlewares/client/settings.middleware");
const authMiddleWare = require("../../middlewares/client/auth.middleware");



module.exports = (app) => {
    app.use(userMiddleWare.infoUser);

    app.use(categoryMiddleWare.category);

    app.use(cartMiddleWare.cartId);

    app.use(settingsMiddleWare.settingsGeneral);
    
    app.use('/', homeRoutes);

    app.use('/products', productsRoutes);

    app.use("/user",  userRoutes);

    app.use("/search",  searchRoutes);

    app.use("/cart",  cartRoutes);

    app.use("/checkout",  checkoutRoutes);

    app.use("/chat", authMiddleWare.requireAuth, chatRoutes);

    app.use("/users",  usersRoutes);

};