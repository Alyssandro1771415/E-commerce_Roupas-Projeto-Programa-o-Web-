const sequelize = require('../db');
const Order = require('../models/OrderModel');
const OrderItem = require('../models/OrderItemModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

class OrderController {
    async createOrder(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        }
        
        const t = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const { items } = req.body; 

            if (!items || items.length === 0) {
                return res.status(400).json({ message: "O carrinho está vazio." });
            }

            const order = await Order.create({
                userId: userId,
                orderDate: new Date()
            }, { transaction: t });

            for (const item of items) {
                const product = await Product.findByPk(item.productId, { transaction: t });

                if (!product) {
                    await t.rollback();
                    return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
                }

                if (product.quantity < item.quantity) {
                    await t.rollback();
                    return res.status(400).json({ message: `Estoque insuficiente para o produto: ${product.productName}. Disponível: ${product.quantity}` });
                }

                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity
                }, { transaction: t });

                product.quantity -= item.quantity;
                await product.save({ transaction: t });
            }

            await t.commit();
            res.status(201).json({ message: "Pedido criado com sucesso!", orderId: order.id });

        } catch (error) {
            await t.rollback();
            console.error("Erro ao criar pedido:", error);
            res.status(500).json({ message: "Erro interno do servidor ao criar pedido." });
        }
    }

    async getUserOrders(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        }

        try {
            const userId = req.user.id;

            const orders = await Order.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: OrderItem,
                        as: 'items', 
                        include: [
                            {
                                model: Product,
                                attributes: ['id', 'productName', 'value']
                            }
                        ]
                    }
                ],
                order: [['orderDate', 'DESC']]
            });

            if (!orders || orders.length === 0) {
                return res.status(200).json([]);
            }

            const formattedOrders = orders.map(order => {
                let totalOrderValue = 0;
                if (order.items && order.items.length > 0) {
                    totalOrderValue = order.items.reduce((sum, currentItem) => {
                        const itemValue = currentItem.Product ? currentItem.Product.value : 0;
                        return sum + (currentItem.quantity * itemValue);
                    }, 0);
                }
                return {
                    ...order.toJSON(),
                    totalOrderValue: parseFloat(totalOrderValue.toFixed(2))
                };
            });

            res.status(200).json(formattedOrders);

        } catch (error) {
            console.error("Erro ao buscar pedidos do usuário:", error);
            res.status(500).json({ message: "Erro interno do servidor ao buscar pedidos." });
        }
    }
}

module.exports = new OrderController();