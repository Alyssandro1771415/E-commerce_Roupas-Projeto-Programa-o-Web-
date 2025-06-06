const express = require('express');
const router = express.Router();
const { getPaymentStatus } = require('../controllers/PaymentStatusController');

router.get('/payment-status', getPaymentStatus);

module.exports = router;
