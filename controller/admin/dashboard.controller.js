const ProductCategory = require("../../model/product-category.model");
const Product = require("../../model/product.model");
const Account = require("../../model/account.model");
const User = require("../../model/user.model");

module.exports.index = async (req, res) => {
  const statistic = {
    category: { total: 0, active: 0, inactive: 0 },
    product: { total: 0, active: 0, inactive: 0 },
    account: { total: 0, active: 0, inactive: 0 },
    user: { total: 0, active: 0, inactive: 0 },
  };

  // Thống kê Danh mục sản phẩm
  statistic.category.total = await ProductCategory.countDocuments({ delete: false });
  statistic.category.active = await ProductCategory.countDocuments({ active: "active", delete: false });
  statistic.category.inactive = await ProductCategory.countDocuments({ active: "inactive", delete: false });

  // Thống kê Sản phẩm
  statistic.product.total = await Product.countDocuments({ delete: false });
  statistic.product.active = await Product.countDocuments({ active: "active", delete: false });
  statistic.product.inactive = await Product.countDocuments({ active: "inactive", delete: false });

  // Thống kê Tài khoản Admin (Quản trị viên)
  statistic.account.total = await Account.countDocuments({ deleted: false });
  statistic.account.active = await Account.countDocuments({ status: "active", deleted: false });
  statistic.account.inactive = await Account.countDocuments({ status: "inactive", deleted: false });

  // Thống kê Tài khoản Client (Người mua hàng)
  statistic.user.total = await User.countDocuments({ deleted: false });
  statistic.user.active = await User.countDocuments({ status: "active", deleted: false });
  statistic.user.inactive = await User.countDocuments({ status: "inactive", deleted: false });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
};