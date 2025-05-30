const { MercadoPagoConfig, Preference } = require('mercadopago');

require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

const createPreference = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens inválidos na requisição.' });
    }

    const response = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      }
    });

    res.status(200).json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento.' });
  }
};

module.exports = { createPreference };
