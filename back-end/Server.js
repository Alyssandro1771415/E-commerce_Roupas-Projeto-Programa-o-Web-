require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');

const User = require('./models/UserModel');
const Product = require('./models/ProductModel');   
const Order = require('./models/OrderModel');       
const OrderItem = require('./models/OrderItemModel'); 

// Route Imports
const UserRoutes = require('./routes/UserRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const OrderRoutes = require('./routes/OrderRoutes'); 


// User <-> Order
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

const server = express();

server.use(express.json());
server.use(cors({
    origin: 'http://localhost:3000',
    exposedHeaders: ['authorization-token'],
    credentials: true,
}));

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
    return sequelize.sync();
  })
  .then(() => {
    server.listen(process.env.SERVER_PORT, () => {
      console.log("Server running at port: " + process.env.SERVER_PORT);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
  });

server.use('/public', express.static(path.join(__dirname, 'public')));


server.use("/api/user", UserRoutes);
server.use("/api/product", ProductRoutes);
server.use('/api/order', OrderRoutes);