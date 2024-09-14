const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// Define your helper functions
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const User = require('../model/userModel');

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};


module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  checkRole,
  authenticate
};
