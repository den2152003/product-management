const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {      
        id: Number,
        title: String,
        description: String,
        product_category_id: {
            type: String,
            default: ""
        },
        price: Number,
        discountPercentage: Number,
        rating: Number,
        stock: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        thumbnail: String,
        delete: {
            type: Boolean,
            default: false
        },
        active: String,
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;