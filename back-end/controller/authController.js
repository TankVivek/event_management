const User = require('../model/userModel');
const { hashPassword, comparePassword, generateToken } = require('../utils/helper');

const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, role });
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
      error: error.message,
    });
  }
};

  const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
      const token = generateToken(user._id);
      res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {register , login};
