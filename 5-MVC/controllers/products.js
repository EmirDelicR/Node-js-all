const Product = require("../models/product");

/** Used in routes/admin.js */
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

/** Used in routes/admin.js */
exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

/** Used in routes/shop.js */
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productsCSS: true
    });
  });
};
