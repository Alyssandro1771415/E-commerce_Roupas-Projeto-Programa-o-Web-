const crypto = require('crypto');
const { payment, verifyWebhookSignature } = require('../MercadoPago');
const { Order, OrderItem } = require('../models/OrderModel');
const Product = require('../models/ProductModel');

const handleWebhook = async (req, res) => {
  try {
    // 1. Verificar assinatura do webhook (segurança)
    if (!verifyWebhookSignature(req)) {
      console.warn('⚠️ Assinatura do webhook inválida');
      return res.status(403).send('Assinatura inválida');
    }

    const { type, data } = req.body;

    console.log('🔔 Webhook recebido:', type, data);

    if (type !== 'payment') {
      return res.status(200).send('Evento não relacionado a pagamento');
    }

    // 2. Obter detalhes do pagamento
    const paymentDetails = await payment.get({ id: data.id });
    const orderId = paymentDetails.external_reference;

    if (!orderId) {
      console.warn('⚠️ External reference (orderId) não encontrado');
      return res.status(400).send('Order ID não encontrado');
    }

    // 3. Atualizar status do pedido
    let orderStatus;
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

    // 4. Atualizar pedido no banco de dados
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.warn(`⚠️ Pedido não encontrado (ID: ${orderId})`);
      return res.status(404).send('Pedido não encontrado');
    }

    await order.update({ status: orderStatus });

    // 5. Atualizar estoque apenas se o pagamento foi aprovado
    if (paymentDetails.status === 'approved' && orderStatus !== 'processando') {
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