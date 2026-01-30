const Product = require('../../model/product.model');

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    const products = await Product.find({
      title: keywordRegex,
      active: "active",
      delete: false
    });

    console.log(products);

    res.render("client/pages/search/index", {
      pageTitle: "Kết quả tìm kiếm",
      keyword: keyword,
      products: products // Thường biến này sẽ được truyền ra view
    });
  }
};