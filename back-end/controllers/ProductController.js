const fs = require('fs');
const path = require('path');
const Product = require('../models/ProductModel');

class ProductController {
    async uploadProductsdata(req, res) {
        try {
            const { productName, productQuantity, productValue } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: "Imagem do produto é obrigatória" });
            }

            const tempPath = path.join(__dirname, '../public/product_images', req.file.filename);

            const newFileName = `${productName.replace(/ /g, "_")}${path.extname(req.file.originalname)}`;
            const newPath = path.join(__dirname, '../public/product_images', newFileName);

            fs.renameSync(tempPath, newPath);

            // Sequelize: procura produto
            const existingProduct = await Product.findOne({ where: { productName } });

            if (existingProduct) {
                // Sequelize: atualiza produto
                await existingProduct.update({
                    quantity: productQuantity,
                    value: productValue
                });

                return res.status(200).json({ message: "Produto atualizado com sucesso" });
            } else {
                // Sequelize: cria novo produto
                const newProduct = await Product.create({
                    productName,
                    quantity: productQuantity,
                    value: productValue
                });

                return res.status(201).json({ message: "Produto cadastrado com sucesso", newProduct });
            }

        } catch (error) {
            console.error("Erro interno:", error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    }

    async getProductDatas(req, res) {
        try {
            const products = await Product.findAll();

            if (products.length > 0) {
                const productImagesPath = path.join(__dirname, '../public/product_images');

                const productsWithImages = products.map(product => {
                    const productNameFormatted = product.productName.replace(/ /g, "_");

                    const files = fs.readdirSync(productImagesPath);
                    const productImage = files.find(file => file.startsWith(productNameFormatted));

                    const imageUrl = productImage
                        ? `${req.protocol}://${req.get('host')}/public/product_images/${productImage}`
                        : null;

                    return {
                        ...product.dataValues,
                        imageUrl
                    };
                });

                return res.status(200).json({
                    message: "Dados de produtos obtidos com êxito!",
                    productsWithImages
                });
            } else {
                return res.status(404).json({ message: "Nenhum produto encontrado." });
            }

        } catch (error) {
            console.error("Erro ao buscar os dados de produtos!", error);
            return res.status(500).json({ message: "Erro ao buscar os dados de produtos!" });
        }
    }
}

module.exports = new ProductController();
