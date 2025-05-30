const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const OrderItem = sequelize.define('OrderItem', {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    references: {
      model: 'orders', 
      key: 'id'
    },
    field: 'order_id' 
  },
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'products',
      key: 'id'
    },
    field: 'product_id' 
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'order_products',
  timestamps: false
});

module.exports = OrderItem;