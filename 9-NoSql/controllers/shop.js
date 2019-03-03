const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(err => console.log("Error from getProducts in shop.js: ", err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (product) {
        res.render("shop/product-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products"
        });
      }
    })
    .catch(err => console.log("Error from getProduct in shop.js: ", err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => console.log("Error from getIndex in shop.js: ", err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cartProducts => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts
      });
    })
    .catch(err => console.log("Error from getCart in shop.js: ", err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log("Item added to cart!");
      res.redirect("/cart");
    })
    .catch(err => confirm.log("Error from postCart: ", err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteProductFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log("Error from postCartDeleteProduct: ", err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log("Error from postOrder: ", err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders
      });
    })
    .catch(err => console.log("Error from getOrders: ", err));
};
