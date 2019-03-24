const fileHelper = require("../util/file");

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
  const image = req.file;
  const productData = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    userId: req.user
  };
  const errors = validationResult(req);

  let imgError = false;
  if (!image) {
    imgError = true;
  }

  if (!errors.isEmpty() || imgError) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      errorMessage: !errors.isEmpty()
        ? errors.array()[0].msg
        : "Attached file is not an image",
      editing: false,
      hasError: true,
      product: productData,
      validationErrors: errors.array()
    });
  }

  productData.imageUrl = image.path;

  const product = new Product(productData);
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log("postAddProduct error in admin.js: ", err);
      res.redirect("/500");
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
    .catch(err => {
      console.log("Error from getEditProduct in admin.js: ", err);
      res.redirect("/500");
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const image = req.file;
  const productUpdatedData = {
    title: req.body.title,
    image: req.file,
    price: req.body.price,
    description: req.body.description,
    _id: prodId
  };

  const errors = validationResult(req);

  let imgError = false;
  if (!image) {
    imgError = true;
  }

  if (!errors.isEmpty() || imgError) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      errorMessage: !errors.isEmpty()
        ? errors.array()[0].msg
        : "Attached file is not an image",
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
      // Delete previous img
      fileHelper.deleteFile(product.imageUrl);
      productUpdatedData.imageUrl = image.path;
      product = Object.assign(product, productUpdatedData);
      return product.save().then(response => {
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      console.log("Error from postEditProduct: ", err);
      res.redirect("/500");
    });
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
    .catch(err => {
      console.log("Error from getProducts in admin.js: ", err);
      res.redirect("/500");
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      if (!product) {
        // return next(new Error("Product not found!"))
        res.redirect("/500");
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log("Error from postDeleteProduct: ", err);
      res.redirect("/500");
    });
};
