require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

class UserController {

    async createUser(req, res) {
        try {
            const {
                name,
                lastName,
                email,
                password,
                cpf,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                celular
            } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Usuário já cadastrado!" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                name,
                lastName,
                email,
                password: hashedPassword,
                cpf,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                celular
            });

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return res.status(500).json({ message: "Erro interno ao criar usuário." });
        }
    }

    async validateLogin(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Login ou senha incorretos!" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Login ou senha incorretos!" });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email
                },
                process.env.JSONWEBTOKEN_SECRET,
                { expiresIn: '1d' }
            );

            res.header("authorization-token", token);

            return res.status(200).json({ message: "Login realizado com sucesso!", token, user });

        } catch (error) {
            console.error("Erro ao validar login:", error);
            return res.status(500).json({ message: "Erro interno ao validar login." });
        }
    }

    async validateToken(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(400).json({ message: "Token não fornecido!" });
            }

            jwt.verify(token, process.env.JSONWEBTOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token inválido." });
                }

                return res.status(200).json({
                    user: {
                        id: decoded.id,
                        name: decoded.name,
                        email: decoded.email
                    }
                });
            });

        } catch (error) {
            console.error("Erro ao validar token:", error);
            return res.status(401).json({ message: "Erro na validação do token." });
        }
    }
}

module.exports = new UserController();