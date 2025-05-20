const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ProductSchema = sequelize.define('Product', {
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = ProductSchema;
