const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res
        .status(401)
        .json({message: 'Unauthorized: Token missing or malformed'});
    }
    const token = authHeader.replace('bearer ', '');
    if (!token) {
      return res
        .status(401)
        .json({message: 'Unauthorized: Token missing or malformed'});
    }
    const decoded = jwt.verify(token, 'mouni12');
    const user = await User.findById(decoded.userId);
    if (
      !user ||
      !user.isLoggedIn ||
      (user.lastLogout && decoded.iat * 1000 < user.lastLogout.getTime())
    ) {
      return res.status(404).json({message: 'User not found'});
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authenticateToken middleware:', error.message);
    return res
      .status(500)
      .json({message: 'Internal server error', error: error.message});
  }
};
module.exports = authenticateToken;
