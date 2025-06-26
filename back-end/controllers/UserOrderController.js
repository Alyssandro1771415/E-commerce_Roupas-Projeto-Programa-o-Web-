const { Order, OrderItem, Product } = require('../models/OrderModel');

class UserOrderController {
    async getUserOrders(req, res) {
        try {
            const token = req.headers['authorization-token'];
            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
            const userId = decoded.id;

            const orders = await Order.findAll({
                where: { user_id: userId },
                include: [
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
                order: [['order_date', 'DESC']]
            });

            res.json({ success: true, orders });
        } catch (error) {
            console.error('Erro ao buscar pedidos do usuário:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Token inválido ou expirado' });
            }
            res.status(500).json({ success: false, error: 'Erro ao buscar pedidos' });
        }
    }

    async getOrderDetails(req, res) {
        try {
            const token = req.headers['authorization-token'];
            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }

            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
            const userId = decoded.id;
            const orderId = req.params.id;

            const order = await Order.findOne({
                where: { id: orderId, user_id: userId },
                include: [
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
                ]
            });

            if (!order) {
                return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
            }

            res.json({ success: true, order });
        } catch (error) {
            console.error('Erro ao buscar detalhes do pedido:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Token inválido ou expirado' });
            }
            res.status(500).json({ success: false, error: 'Erro ao buscar detalhes do pedido' });
        }
    }
}

module.exports = new UserOrderController();