const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'order_date' 
  }
}, {
  tableName: 'orders',
  timestamps: false 
});

module.exports = Order;