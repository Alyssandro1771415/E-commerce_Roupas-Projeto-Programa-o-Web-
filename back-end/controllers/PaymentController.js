const { MercadoPagoConfig, Preference } = require('mercadopago');

require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

const createPreference = async (req, res) => {
  try {
    const response = await preference.create({
      body: {
        items: [
          {
            title: 'Meu produto',
            quantity: 1,
            unit_price: 2000,
          }
        ]
      }
    });

    // Verifica se a resposta contém os campos esperados (Teste de integridade)
    console.log('Preferência criada:', {
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });

    res.status(200).json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento.' });
  }
};


module.exports = { createPreference };
