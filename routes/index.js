const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController.js');
const profileController = require('../controllers/Profile.js'); 
const productController = require('../controllers/Product.js'); 
const cart = require('../controllers/cart');

const upload = require('../middlewares/multer.js');
const wishlist = require('../controllers/wishlist.js');
// Login signup
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Profile routes
router.get('/profiles', profileController.getAllProfiles);
router.get('/profiles/:userId', profileController.getProfile);
router.post('/profiles', profileController.createProfile);
router.put('/profiles/:userId', profileController.updateProfile);
router.delete('/profiles/:userId', profileController.deleteProfile);
 

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:productId', productController.getProduct); 
router.post('/products',upload, productController.createProduct);
router.put('/products/:productId',upload, productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct); 
router.get('/products/:user_id' , productController.getProductByUserID)

 
router.post('/cart/:userId', cart.addToCart);


// Delete a product from the cart
router.delete('/cart/:userId', cart.deleteFromCart);
router.post('/wishlist/:userId',wishlist.addToWishlist);

// Get products in thewishlist for a user
router.get('/wishlist/:userId',wishlist.getWishlistProducts);

// Delete a product from thewishlist
router.delete('/wishlist/:userId',wishlist.deleteFromWishlist); 

module.exports = router;
