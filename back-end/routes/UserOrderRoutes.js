const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Order, OrderItem, Product } = require('../models');

router.get('/me', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Token não fornecido' });

    const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
    const userId = decoded.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { model: Product, attributes: ['productName', 'value'] }
          ]
        }
      ],
      order: [['order_date', 'DESC']]
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Erro ao buscar pedidos do usuário:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar pedidos' });
  }
});

module.exports = router;
