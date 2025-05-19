const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

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

module.exports = router;