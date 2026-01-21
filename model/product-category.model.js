const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
    {      
        title: String,
        parent_id:{
            type: String,
            default: false
        }, 
        description: String,
        category: String,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        thumbnail: String,
        position: Number,
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

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category");

module.exports = ProductCategory;