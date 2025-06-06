const { MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const payment = new Payment(client);

const getPaymentStatus = async (req, res) => {
  const { payment_id } = req.query;

  if (!payment_id) {
    return res.status(400).json({ error: 'Parâmetro payment_id é obrigatório.' });
  }

  try {
    const result = await payment.get({ id: payment_id });

    return res.status(200).json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: result.transaction_amount,
      payer_email: result.payer?.email,
      date_approved: result.date_approved,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar status do pagamento:', error.message);
    return res.status(500).json({ error: 'Erro ao buscar status do pagamento.' });
  }
};

module.exports = { getPaymentStatus };
