const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: String,
    quantity: Number,
    value: Number,
});

module.exports = mongoose.model('Product', productSchema);