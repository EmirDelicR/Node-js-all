const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(data, id, userId) {
    this.title = data.title;
    this.price = data.price;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this._userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperation;
    let dbOperationType;
    if (this._id) {
      // Update product
      dbOperationType = "Updated";
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Insert new product
      dbOperationType = "Inserted";
      dbOperation = db.collection("products").insertOne(this);
    }
    return dbOperation
      .then(result => console.log(`Product ${dbOperationType}!`))
      .catch(err => console.log("DB insert Product error: ", err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log("DB fetchAll Products error: ", err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => console.log("DB findById Product error: ", err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then(result => console.log(`Record with id ${productId} is deleted!`))
      .catch(err => console.log("DB findById Product error: ", err));
  }
}

module.exports = Product;
