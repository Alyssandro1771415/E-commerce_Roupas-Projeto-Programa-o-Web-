const { compareSync } = require('bcrypt');
const { payment } = require('../MercadoPago');
const { Order, OrderItem } = require('../models/OrderModel');
const Product = require('../models/ProductModel');

const handleWebhook = async (req, res) => {
  try {

    const { type, data } = req.body;

    console.log('📩 Corpo recebido no webhook:', JSON.stringify(req.body, null, 2));

    console.log(`🔔 Recebido webhook do tipo: ${type}, ${data}`);

    if (type !== 'payment') {
      return res.status(200).send('Evento não relacionado a pagamento');
    }

    const paymentDetails = await payment.get({ id: data.id });
    const orderId = paymentDetails.external_reference;

    console.log(`🔔 Recebido webhook de pagamento: ${paymentDetails} para o pedido ID ${orderId}`);

    if (!orderId) {
      console.warn('⚠️ External reference (orderId) não encontrado');
      return res.status(400).send('Order ID não encontrado');
    }

    switch (paymentDetails.status) {
      case 'approved':
        orderStatus = 'processando';
        break;
      case 'pending':
        orderStatus = 'pendente';
        break;
      case 'rejected':
        orderStatus = 'cancelado';
        break;
      case 'refunded':
        orderStatus = 'reembolsado';
        break;
      default:
        orderStatus = 'pendente';
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      console.warn(`⚠️ Pedido não encontrado (ID: ${orderId})`);
      return res.status(404).send('Pedido não encontrado');
    }

    await order.update({ status: orderStatus });

    if (orderStatus === 'processando') {
      const horaPagamento = new Date().toLocaleString('pt-BR');
      console.log(`🟢 [${horaPagamento}] Pagamento confirmado para o pedido ID ${orderId}`);

      const items = await OrderItem.findAll({ where: { orderId } });

      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          await product.save();
          console.log(`✅ Estoque atualizado: ${product.productName} -${item.quantity}`);
        }
      }
    }


    console.log(`📦 Pedido ${orderId} atualizado para status: ${orderStatus}`);
    res.sendStatus(200);

  } catch (error) {
    console.error('❌ Erro no webhook:', error.message);
    res.status(500).send('Erro interno no servidor');
  }
};

module.exports = { handleWebhook };