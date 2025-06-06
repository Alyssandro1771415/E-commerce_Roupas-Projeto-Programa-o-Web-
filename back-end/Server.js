require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./db');
const UserRoutes = require('./routes/UserRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const PaymentRoutes = require('./routes/PaymentRoutes');
const PaymentStatusRoutes = require('./routes/PaymentStatusRoutes');
const WebhookController = require('./routes/StatusRoutes');

const server = express();

// Middleware express.raw para capturar o corpo cru apenas na rota do webhook
server.use('/api/webhook', express.raw({ type: 'application/json' }));

// Middleware para JSON padrão nas outras rotas
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
server.use('/api/paymentStatus', PaymentStatusRoutes);

// Essa rota deve vir depois do express.raw para funcionar corretamente
server.use('/api/webhook', WebhookController);
