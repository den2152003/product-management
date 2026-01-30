const Product = require('../../model/product.model');
const ProductCategory = require('../../model/product-category.model');


//[GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
    });
    //foreach cũng đc nha
    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
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
            slug: req.params.slugProduct,
            active: "active"
        };

        const product = await Product.findOne(find);

        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                active: "active",
                delete: false
            });

            product.category = category;
        }

        product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);

        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect("/products");
    }
}

//[GET] /products/:slug
module.exports.slugCategory = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        delete: false,
        active: "active"
    });


    const getSubCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            active: "active",
            delete: false,
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSub = allSub.concat(childs);
        }

        return allSub;
    }

    const listSubCategory = await getSubCategory(category._id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    console.log(listSubCategoryId);

    const products = await Product.find({
        product_category_id: { $in: [category._id, ...listSubCategoryId] },
        delete: false
    });

    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    });

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: products,
    });
}