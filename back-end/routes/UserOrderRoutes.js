const express = require('express');
const router = express.Router();
const UserOrderController = require('../controllers/UserOrderController');

// Rota para listar todos os pedidos do usuário
router.get('/', UserOrderController.getUserOrders);

// Rota para detalhes de um pedido específico do usuário
router.get('/:id', UserOrderController.getOrderDetails);

module.exports = router;