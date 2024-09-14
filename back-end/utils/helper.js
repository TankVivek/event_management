const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

module.exports = {
  hashPassword,
  comparePassword,
  generateToken
};
