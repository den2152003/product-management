const Product = require('../../model/product.model');

//[GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
    });
    //foreach cũng đc nha
    products.forEach(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
    });


    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products
    });
}

//[GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            delete: false,
            slug: req.params.slug,
            active: "active"
        };

        const product = await Product.findOne(find);
        
        console.log(product);

        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
    });
    } catch (error) {
        res.redirect("/products");
    }
}