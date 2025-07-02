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
const UserOrderRoutes = require('./routes/UserOrderRoutes');

const server = express();

server.use('/api/webhook', express.json());
server.use(express.json());
server.use(cors({
    origin: 'http://localhost:3000',
    exposedHeaders: ['authorization-token'],
    credentials: true,
}));

server.use('/public', express.static(path.join(__dirname, 'public')));
server.use("/api/user", UserRoutes);
server.use("/api/product", ProductRoutes);
server.use("/api/payment", PaymentRoutes);
server.use('/api/admin/orders', OrderRoutes);
server.use('/api/orders', UserOrderRoutes);
server.use('/api/webhook', WebhookController);

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_INTERVAL_MS = 5000;

async function startServerWithRetry() {
  let attempts = 0;
  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexão com o banco de dados MySQL estabelecida!');
      await sequelize.sync();
      server.listen(process.env.SERVER_PORT, () => {
        console.log(`🚀 Server rodando na porta ${process.env.SERVER_PORT}`);
      });
      return;
    } catch (err) {
      attempts++;
      console.error(`❌ Erro ao conectar ao banco de dados (tentativa ${attempts}/${MAX_RETRY_ATTEMPTS}):`, err.message);
      if (attempts >= MAX_RETRY_ATTEMPTS) {
        console.error('🔴 Máximo de tentativas atingido. Encerrando aplicação.');
        process.exit(1);
      }
      console.log(`⏳ Aguardando ${RETRY_INTERVAL_MS / 1000}s para nova tentativa...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }
}

startServerWithRetry();
