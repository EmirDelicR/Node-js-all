const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const adminData = require("./admin");

/** always put '/' last because code is execute from top-to-bottom */
router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productsCSS: true
  });
  /** Sending response */
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
