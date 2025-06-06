const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Order, OrderItem } = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

const createPreference = async (req, res) => {
  try {
    const { items } = req.body;
    const token = req.headers['authorization-token'];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);
    const userId = decoded.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Lista de itens inválida ou vazia' });
    }

    const products = await Product.findAll({
      where: {
        productName: items.map(item => item.title)
      }
    });

    if (products.length !== items.length) {
      const foundProducts = products.map(p => p.productName);
      const missingProducts = items.filter(item => !foundProducts.includes(item.title));
      return res.status(404).json({ 
        error: 'Alguns produtos não foram encontrados',
        missingProducts: missingProducts.map(p => p.title)
      });
    }

    const verifiedItems = items.map(item => {
      const product = products.find(p => p.productName === item.title);
      return {
        ...item,
        id: product.id,
        unit_price: parseFloat(product.value)
      };
    });

    const total = verifiedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    const order = await Order.create({
      user_id: userId,
      status: 'pendente'
    });

    await OrderItem.bulkCreate(
      verifiedItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity
      }))
    );

    const response = await preference.create({
      body: {
        items: verifiedItems.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price
        })),
        external_reference: order.id.toString(),
        notification_url: process.env.WEBHOOK_URL,
        back_urls: {
          success: process.env.MP_SUCCESS_URL,
          failure: process.env.MP_FAILURE_URL,
          pending: process.env.MP_PENDING_URL
        }
      }
    });

    res.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      orderId: order.id,
      total,
      email: decoded.email
    });

  } catch (error) {
    console.error('Erro no processamento do pagamento:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Erro de validação',
        details: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      message: error.message 
    });
  }
};

module.exports = { createPreference };