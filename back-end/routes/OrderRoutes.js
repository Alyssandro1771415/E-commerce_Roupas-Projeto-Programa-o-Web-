const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminValidation');
const { Order, OrderItem, User, Product } = require('../models');

router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 1000 } = req.query;
    const whereClause = {};
    if (status && status !== 'all') whereClause.order_status = status;

    const { rows: orders, count } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              attributes: ['productName', 'value']
            }
          ]
        }
      ],
      order: [['order_date', 'DESC']],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    res.json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      orders,
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar pedidos' });
  }
});

// Rota final será: GET /api/admin/orders/:id
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User,
          as: 'user',
          attributes: ['name', 'email'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, attributes: ['productName', 'quantity'] }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
    }

    res.json({ success: true, data: [order, products] });
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar pedido' });
  }
});

// Rota final será: PUT /api/admin/orders/:id/status
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const validStatuses = ['PENDING','PAID','SHIPPED','DELIVERED','CANCELED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Status inválido' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
    }

    order.order_status = status;
    await order.save();

    res.json({ success: true, message: 'Status atualizado com sucesso', data: order });
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar status' });
  }
});



module.exports = router;