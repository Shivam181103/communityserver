// Import required dependencies
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hasFreeShipping: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    required: true
  },
  brand: {
    type: String, 
  },
  price: {
    type: Number, 
  },
  rating: {
    type: Number, 
  },
  description: {
    type: String, 
  } ,
  user_id: {
    type: String, 
  }
});

// Create the product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
