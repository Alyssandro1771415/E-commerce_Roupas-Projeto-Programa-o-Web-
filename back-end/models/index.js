const sequelize = require('../db');

const User = require('./UserModel');
const Product = require('./ProductModel');
const { Order, OrderItem } = require('./OrderModel');


// Relação: Um Pedido (Order) pertence a um Usuário (User)
Order.belongsTo(User, { foreignKey: 'userId', allowNull: false });
User.hasMany(Order, { foreignKey: 'userId' });

// Relação: Um Pedido (Order) tem muitos Itens de Pedido (OrderItem)
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId', allowNull: false });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Relação: Um Item de Pedido (OrderItem) está ligado a um Produto (Product)
OrderItem.belongsTo(Product, { foreignKey: 'productId', allowNull: false });
Product.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'productId' });


module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
};