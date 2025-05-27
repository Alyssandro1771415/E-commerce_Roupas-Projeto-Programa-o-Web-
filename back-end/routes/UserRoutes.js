const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const isAdmin = require('../middlewares/adminValidation');

// Rota de criação de novos usuários
router.post("/cadaster", (req, res) => UserController.createUser(req, res));
// Rota para validar login de usuários
router.post("/login", (req, res) => UserController.validateLogin(req, res));
// Rota para validação do token de usuário
router.post("/verify-token", UserController.validateToken, (req, res) => {
    res.status(200).json({
        user: {
            email: req.user.email,
        }
    });
});
// Rota para validar login de usuário administrador
router.post('/admin', isAdmin, (req, res) => {
  res.json({ isAdmin: true });
});

module.exports = router;