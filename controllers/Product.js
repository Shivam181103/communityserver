const Product = require('../models/Book.js');

// Controller function for creating a product
const createProduct = async (req, res) => {
  try {
    const { name, hasFreeShipping, brand, price, rating, description, user_id } = req.body;
    const { filename } = req.file; // Multer provides the filename of the uploaded file 
    // Create a new product object
    const product = new Product({
      name,
      hasFreeShipping,
      image: `uploads/${filename}`, // Store the relative path of the uploaded image
      brand,
      price,
      rating,
      description,
      user_id
    });
     console.log(product);
    // Save the product to the database
    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add product' });
  }
};

// Controller function for updating a product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, hasFreeShipping, brand, price, rating, description } = req.body;
    const { filename } = req.file; // Updated image file

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Delete the previous image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, product.image);
      fs.unlinkSync(imagePath);
    }

    // Update the product fields
    product.name = name || product.name;
    product.hasFreeShipping = hasFreeShipping || product.hasFreeShipping;
    product.image = filename ? `uploads/${filename}` : product.image;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.rating = rating || product.rating;
    product.description = description || product.description;

    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

// Controller function for deleting a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Delete the product
    await product.remove();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
 
// Controller function for retrieving all products with filters
const getAllProducts = async (req, res) => {
  try {
    const { name, brand, price, rating } = req.query;

    // Create a filter object based on the query parameters
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive name matching
    }
    if (brand) {
      filter.brand = brand;
    }
    if (price) {
      filter.price = price;
    }
    if (rating) {
      filter.rating = rating;
    }

    // Fetch products based on the filter
    const products = await Product.find(filter);

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
  };
  
  const getProductByUserID =async (req , res)=>{
    try {
      const userId = req.params.userId;
  
      // Find products based on user ID
      const products = await Product.find({ user_id: userId });
  
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
  }


// Controller function for retrieving a single product
const getProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
}; 

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Assuming you have a User model with a "cart" field representing the user's cart
    req.user.cart.push(product);
    await req.user.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Assuming you have a User model with a "wishlist" field representing the user's wishlist
    req.user.wishlist.push(product);
    await req.user.save();

    res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    // Assuming you have a User model with a "cart" field representing the user's cart
    await req.user.populate('cart').execPopulate();

    const cartItems = req.user.cart;

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user cart' });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    // Assuming you have a User model with a "wishlist" field representing the user's wishlist
    await req.user.populate('wishlist').execPopulate();

    const wishlistItems = req.user.wishlist;

    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user wishlist' });
  }
};

// Delete product from wishlist
const deleteFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Assuming you have a User model with a "wishlist" field representing the user's wishlist
    req.user.wishlist = req.user.wishlist.filter(item => item.toString() !== productId);
    await req.user.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
};

// Delete product from cart
const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Assuming you have a User model with a "cart" field representing the user's cart
    req.user.cart = req.user.cart.filter(item => item.toString() !== productId);
    await req.user.save();

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove product from cart' });
 
  }
}

// Clear complete cart
const clearCart = async (req ,res) => {
  const cartItems = []
  res.json({ success: true, message: 'Cart items cleared successfully', cartItems });
}
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductByUserID,
  getProduct,
  addToCart,
  addToWishlist,
  getCart,
  getWishlist,
  deleteFromWishlist,
  deleteFromCart,
  clearCart
};
