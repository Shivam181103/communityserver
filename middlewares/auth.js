const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()
// Middleware function for authentication
const authenticate = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    // Attach the user and token to the request object
    req.user = user;
    req.token = token;

    // Continue to the next middleware
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = authenticate;
