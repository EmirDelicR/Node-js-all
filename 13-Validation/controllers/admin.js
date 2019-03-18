const { validationResult } = require("express-validator/check");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Add Product",
      errorMessage: errors.array()[0].msg,
      editing: false,
      hasError: true,
      product: productData,
      validationErrors: errors.array()
    });
  }

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
        hasError: false,
        errorMessage: null
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
    description: req.body.description,
    _id: prodId
  };

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      errorMessage: errors.array()[0].msg,
      editing: true,
      hasError: true,
      product: productUpdatedData,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product = Object.assign(product, productUpdatedData);
      return product.save().then(response => {
        res.redirect("/admin/products");
      });
    })
    .catch(err => console.log("Error from postEditProduct: ", err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id") // select specific fields (-_id remove _id field)
    // .populate("userId", "name") // make sub query fetch user but only name
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log("Error from getProducts in admin.js: ", err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log("Error from postDeleteProduct: ", err));
};
