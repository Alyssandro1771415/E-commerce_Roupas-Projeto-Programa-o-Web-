require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');
const UserRoutes = require('./routes/UserRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const PaymentRoutes = require('./routes/PaymentRoutes');
const WebhookController = require('./routes/StatusRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const UserOrderRoutes = require('./routes/UserOrderRoutes')

const server = express();

server.use('/api/webhook', express.json());

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
    console.error('Erro ao conectar com o banco de dados:', err);
  });

server.use('/public', express.static(path.join(__dirname, 'public')));
server.use("/api/user", UserRoutes);
server.use("/api/product", ProductRoutes);
server.use("/api/payment", PaymentRoutes);
server.use('/api/admin/orders', OrderRoutes);
server.use('/api/user/orders', UserOrderRoutes);

server.use('/api/webhook', WebhookController);
