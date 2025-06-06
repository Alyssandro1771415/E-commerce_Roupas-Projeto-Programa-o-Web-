require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require('../models/UserModel');

function isAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
    if (decoded.email === process.env.ADMIN_EMAIL) {
      return next();
    }
    return res.status(403).json({ message: "Acesso restrito ao administrador" });
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      _id: decoded.userId,
      isAdmin: true 
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Acesso restrito a administradores' 
    });
  }
};

module.exports = adminAuth;

module.exports = isAdmin;
