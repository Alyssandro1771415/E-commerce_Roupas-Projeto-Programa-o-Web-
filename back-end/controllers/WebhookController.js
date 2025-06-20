const { payment } = require('../MercadoPago');
const { Order, OrderItem } = require('../models/OrderModel');
const Product = require('../models/ProductModel');

const handleWebhook = async (req, res) => {
  try {

    const { type, data } = req.body;

    if (type !== 'payment') {
      return res.status(200).send('Evento não relacionado a pagamento');
    }

    const paymentDetails = await payment.get({ id: data.id });
    const order_id = paymentDetails.external_reference;

    if (!order_id) {
      console.warn('⚠️ External reference (order_id) não encontrado');
      return res.status(400).send('Order ID não encontrado');
    }

    switch (paymentDetails.status) {
      case 'approved':
        orderStatus = 'PAID';
        break;
      case 'pending':
        orderStatus = 'PENDING';
        break;
      case 'rejected':
        orderStatus = 'CANCELED';
        break;
      case 'refunded':
        orderStatus = 'CANCELED';
        break;
      default:
        orderStatus = 'PENDING';
    }

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).send('Pedido não encontrado');
    }

    await order.update({ order_status: orderStatus });

    if (orderStatus === 'PAID') {

      const items = await OrderItem.findAll({ where: { order_id } });

      for (const item of items) {

        const product = await Product.findByPk(item.dataValues.product_id);

        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          await product.save();
        }
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('❌ Erro no webhook:', error.message);
    res.status(500).send('Erro interno no servidor');
  }
};

module.exports = { handleWebhook };