const crypto = require('crypto');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const Product = require('../models/ProductModel');
require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const payment = new Payment(client);

const handleWebhook = async (req, res) => {
  try {
    const rawBody = req.body;

    // Precisa converter o Buffer em string para fazer parse
    const { type, data } = JSON.parse(rawBody.toString());

    console.log('🔔 Webhook recebido:', type, data);

    if (type === 'payment') {
      const result = await payment.get({ id: data.id });

      if (result.status === 'approved') {
        const items = result.additional_info?.items;

        if (items && items.length > 0) {
          for (const item of items) {
            const { id, quantity } = item;
            const product = await Product.findByPk(id);

            if (product) {
              product.stock = Math.max(0, product.stock - quantity);
              await product.save();
              console.log(`✅ Estoque atualizado: ${product.name} -${quantity}`);
            } else {
              console.warn(`❌ Produto não encontrado (id: ${id})`);
            }
          }
        } else {
          console.warn("⚠️ Nenhum item encontrado na informação adicional.");
        }
      }

      console.log('📦 Pagamento processado com status:', result.status);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Erro no webhook:', error.message);
    res.sendStatus(500);
  }
};

module.exports = { handleWebhook };
