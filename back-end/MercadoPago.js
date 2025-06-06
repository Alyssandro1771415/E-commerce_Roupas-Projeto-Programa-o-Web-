import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { config } from 'dotenv';

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

// Função para validar assinatura do webhook
const verifyWebhookSignature = (req) => {
  const signature = req.headers['x-signature'];
  if (!signature) return false;
  
  const hash = crypto
    .createHmac('sha256', process.env.MERCADO_PAGO_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');
    
  return signature === `sha256=${hash}`;
};

export { preference, payment, getPaymentStatus, verifyWebhookSignature };