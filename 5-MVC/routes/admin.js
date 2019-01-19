const express = require("express");

const router = express.Router();
const productsController = require("../controllers/products");

/** GET add-product page */
router.get("/add-product", productsController.getAddProduct);
/** POST add product */
router.post("/product", productsController.postAddProduct);

module.exports = router;
