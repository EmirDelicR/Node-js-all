const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.cart = userData.cart;
    this._id = userData._id;
  }

  save() {
    const db = getDb();
    db.collection("users")
      .insertOne(this)
      .then(result => console.log("User inserted!"))
      .catch(err => console.log("DB insert User error: ", err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.productId.toString() === product._id.toString()
    );

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updateCart = {
      items: updatedCartItems
    };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updateCart } }
      )
      .then(result => console.log("User (addToCart) updated!"))
      .catch(err => console.log("DB update (addToCart) User error: ", err));
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => item.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(product => {
          let cartItem = this.cart.items.find(item => {
            return item.productId.toString() === product._id.toString();
          });
          return {
            ...product,
            quantity: cartItem.quantity
          };
        });
      });
  }

  deleteProductFromCart(productId) {
    const updateCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updateCartItems } } }
      )
      .then(result => console.log("User (deleteProductFromCart) updated!"))
      .catch(err =>
        console.log("DB update (deleteProductFromCart) User error: ", err)
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name
          }
        };
        return db.collection("orders").insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch(err => {
        console.log("Error from (addOrder) for User: ", err);
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) }).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => console.log("DB findById User error: ", err));
  }
}

module.exports = User;
