const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/WebhookController');

router.post('/', handleWebhook);

module.exports = router;
