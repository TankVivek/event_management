const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const generateToken = (userId , role) => {
  return jwt.sign({ id: userId , role:role}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const verifyAdmin = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')
      ? authorization.slice(7, authorization.length)
      : authorization;
      const decodedToken = jwt.verify(token, secretKey);
    if (decodedToken.role === "admin") {
      next();
    } else {
      res.status(401).send({ error: "Unauthorized", success: false });
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized", success: false });
  }
};

const VerifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')
      ? authorization.slice(7, authorization.length)
      : authorization;
    const jt = jwt.verify(token, secretKey);
    if (jt) {
      next();
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized", success: false });
  }
};


module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyAdmin,
  VerifyToken
};
