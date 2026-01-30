const Product = require('../../model/product.model');

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        delete: false,
        active: "active"
    });

    

    productsFeatured.forEach(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
    });

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: productsFeatured
    });
};
