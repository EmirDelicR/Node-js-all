const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const productData = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
    userId: req.user
  };
  const product = new Product(productData);
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log("postAddProduct error in admin.js: ", err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log("Error from getEditProduct in admin.js: ", err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const productUpdatedData = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  };

  Product.findById(prodId)
    .then(product => {
      product = Object.assign(product, productUpdatedData);
      return product.save();
    })
    .then(response => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log("Error from postEditProduct: ", err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price -_id") // select specific fields (-_id remove _id field)
    // .populate("userId", "name") // make sub query fetch user but only name
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log("Error from getProducts in admin.js: ", err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log("Error from postDeleteProduct: ", err));
};
