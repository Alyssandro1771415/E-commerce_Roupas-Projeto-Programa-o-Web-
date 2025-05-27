require("dotenv").config();
const jwt = require("jsonwebtoken");

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

module.exports = isAdmin;
