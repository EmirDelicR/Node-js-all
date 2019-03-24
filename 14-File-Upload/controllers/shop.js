const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
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
  Product.find()
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
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      cartProducts = user.cart.items;
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
    .removeFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log("Error from postCartDeleteProduct: ", err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      cartProducts = user.cart.items.map(item => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: cartProducts
      });

      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log("Error from postOrder: ", err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders
      });
    })
    .catch(err => console.log("Error from getOrders: ", err));
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        // return next(new Error('No order found.'))
        return next();
      }
      // Check if order belong to user
      if (order.user.userId.toString() !== req.user._id.toString()) {
        // return next(new Error('Unauthorized!'))
        return next();
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      // Create PDF-s
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      // inline - open inline
      // attachment - download directly
      res.setHeader("Content-Disposition", `inline; filename='${invoiceName}'`);
      // Store on server
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // Pipe to client
      pdfDoc.pipe(res);

      // Add text to PDF
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true
      });
      pdfDoc.text("------------------------------");
      let total = 0;
      order.products.forEach(prod => {
        total += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title}-${prod.quantity} x $ ${prod.product.price}`
          );
      });
      pdfDoc.fontSize(20).text(`Total Price: $ ${total}`);
      pdfDoc.end();

      /* Use this only on small files
      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next();
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename='${invoiceName}'`
        );
        res.send(data);
      });
      */
      // Upper code is not ok for large data (stream data instead)
      /* Only for reading PDF
      const file = fs.createReadStream(invoicePath);
      res.setHeader("Content-Type", "application/pdf");
      // inline - open inline
      // attachment - download directly
      res.setHeader("Content-Disposition", `inline; filename='${invoiceName}'`);
      file.pipe(res);
      */
    })
    .catch(err => console.log("Error from getInvoice: ", err));
};
