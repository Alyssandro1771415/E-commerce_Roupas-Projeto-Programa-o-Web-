// models/index.js
const sequelize = require('../db');

const User = require('./UserModel');
const Product = require('./ProductModel');
const { Order, OrderItem } = require('./OrderModel');

// Associações
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'product_id' });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};