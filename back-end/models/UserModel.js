const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    endereco: {
        rua: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String },
        bairro: { type: String },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        cep: { type: String, required: true }
    },
    celular: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
