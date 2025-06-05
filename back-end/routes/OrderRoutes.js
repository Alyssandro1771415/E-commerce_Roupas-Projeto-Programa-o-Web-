const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');

router.get('/admin/pedidos', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      orders
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar pedidos' 
    });
  }
});

router.get('/admin/pedidos/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email address')
      .populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Pedido não encontrado' 
      });
    }

    res.json({ 
      success: true,
      data: order 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar pedido' 
    });
  }
});

router.put('/admin/pedidos/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Status inválido' 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'email');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Pedido não encontrado' 
      });
    }

    res.json({ 
      success: true,
      message: 'Status atualizado com sucesso',
      data: order 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Erro ao atualizar status' 
    });
  }
});

router.delete('/admin/pedidos/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Pedido não encontrado' 
      });
    }

    res.json({ 
      success: true,
      message: 'Pedido removido com sucesso' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Erro ao remover pedido' 
    });
  }
});

module.exports = router;