const Cart = require('../models/cart');
const Product = require('../models/Book');

// Add a product to the cart
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId });

    // If the cart does not exist, create a new cart
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: []
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Add the product to the cart
    cart.products.push(product);
    await cart.save();

    res.status(200).json({ success: true, cart: cart.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add product to cart' });
  }
};

// Get products in the cart for a user
const getCartProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId }).populate('products');
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    res.status(200).json({ success: true, cart: cart.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get cart products' });
  }
};

// Delete a product from the cart
const deleteFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(product => product.toString() !== productId);
    await cart.save();

    res.status(200).json({ success: true, message: 'Product removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to remove product from cart' });
  }
};

module.exports = {
  addToCart,
  getCartProducts,
  deleteFromCart
};
