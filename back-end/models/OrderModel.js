const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pendente', 'processando', 'enviado', 'entregue', 'cancelado'),
    defaultValue: 'pendente'
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

const OrderItem = sequelize.define('OrderItem', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: false
});

const User = require('./User');
const Product = require('./Product');

Order.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Order.hasMany(OrderItem, { as: 'items', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

OrderItem.belongsTo(Order, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', allowNull: false });

module.exports = { Order, OrderItem };
