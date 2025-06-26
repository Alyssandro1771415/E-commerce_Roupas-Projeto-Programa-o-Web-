const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { config } = require('dotenv');

config();

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const preference = new Preference(client);
const payment = new Payment(client);

// Função para verificar status do pagamento
const getPaymentStatus = async (paymentId) => {
  try {
    return await payment.get({ id: paymentId });
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    throw error;
  }
};

module.exports = { preference, payment, getPaymentStatus };
