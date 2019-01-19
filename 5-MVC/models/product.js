const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");
/** Helper function */
const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

/** Can be done as a function  */
// module.exports = function Product() {}
/** or Class */
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  /**
   * Static make sure that you can call method directly on the class itself
   * and not on instance so basically you dont need instance to call this function
   * like:
   *    let b = new Product("Some title");
   *    b.fetchAll();
   * you can call it like
   *    Product.fetchAll()
   */
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
