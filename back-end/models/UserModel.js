const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  enderecoRua: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enderecoNumero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enderecoComplemento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enderecoBairro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enderecoCidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enderecoEstado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enderecoCep: {
    type: DataTypes.STRING,
    allowNull: false
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
