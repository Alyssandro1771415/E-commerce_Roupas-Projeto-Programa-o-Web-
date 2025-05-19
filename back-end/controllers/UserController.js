require('dotenv').config()
const bcrypt = require('bcrypt');
const UserSchemaInstancy = require('../model/UserModel');
const jwt = require('jsonwebtoken');

class UserController {

    async createUser(req, res) {
        try {
            const { name, lastName, email, password } = req.body;
            
            const existingUser = await UserSchemaInstancy.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Usuário já cadastrado!" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new UserSchemaInstancy({ name, lastName, email, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

        } catch (error) {
            return res.status(500).json({ message: "Erro interno ao criar usuário." });
        }
    }

    async validateLogin(req, res) {
        try {

            const { email, password } = req.body;

            const existingUser = await UserSchemaInstancy.findOne({ email });
            if (!existingUser) {
                return res.status(401).json({ message: "Login ou senha incorretos!" });
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Login ou senha incorretos!" });
            }

            const token = jwt.sign(
                {_id: existingUser._id, 
                name: existingUser.name, 
                lastName: existingUser.lastName, 
                email: existingUser.email
            }, process.env.JSONWEBTOKEN_SECRET);
            res.header("authorization-token", token);

            return res.status(200).json({ message: "Login realizado com sucesso!", user: existingUser });

        } catch (error) {
            
            return res.status(500).json({ message: "Erro interno ao validar login." });
        
        }
    }

    async validateToken(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(400).json({ message: "Não foi identificado nenhum token na requisição!" });
            }
    
            jwt.verify(token, process.env.JSONWEBTOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Token de usuário não válido." });
                }
                
                req.user = decoded;                
                return res.status(200).json({
                    user: {
                        email: req.user.email,
                    }
                });
            });
    
        } catch (error) {
            return res.status(401).json({ message: "Erro na validação do token de usuário." });
        }
    }
}    

module.exports = new UserController();