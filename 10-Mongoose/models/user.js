const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
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
      productId: product._id,
      quantity: newQuantity
    });
  }

  const updateCart = {
    items: updatedCartItems
  };

  this.cart = updateCart;
  return this.save()
    .then(result => console.log("User (addToCart) updated!"))
    .catch(err => console.log("DB update (addToCart) User error: ", err));
};

userSchema.methods.removeFromCart = function(productId) {
  const updateCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updateCartItems;

  return this.save()
    .then(result => console.log("User (removeFromCart) product deleted!"))
    .catch(err =>
      console.log("DB update (removeFromCart) Product error: ", err)
    );
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  this.save()
    .then(result => console.log("User (clearCart) cart cleared!"))
    .catch(err => console.log("DB update (clearCart) Cart error: ", err));
};

module.exports = mongoose.model("User", userSchema);
