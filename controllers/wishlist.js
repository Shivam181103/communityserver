const Wishlist = require('./models/wishlist');

// Add a product to the wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find the wishlist for the user
    let wishlist = await Wishlist.findOne({ user: userId });

    // If the wishlist does not exist, create a new wishlist
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: []
      });
    }

    // Add the product to the wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ success: true, wishlist: wishlist.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add product to wishlist' });
  }
};

// Get products in the wishlist for a user
const getWishlistProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' });
    }

    res.status(200).json({ success: true, wishlist: wishlist.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get wishlist products' });
  }
};

// Delete a product from the wishlist
const deleteFromWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(product => product.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to remove product from wishlist' });
  }
};

module.exports = {
  addToWishlist,
  getWishlistProducts,
  deleteFromWishlist
};
