const fs = require('fs');
const path = require('path');
const ModelSchemaInstancy = require('../model/ProductModel');

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

            fs.rename(tempPath, newPath, (err) => {
                if (err) {
                    console.error("Erro ao renomear a imagem:", err);
                }
            });

            const existingProduct = await ModelSchemaInstancy.findOne({ productName });

            if (existingProduct) {
                await ModelSchemaInstancy.updateOne(
                    { productName },
                    { $set: { quantity: productQuantity, value: productValue } }
                );
                return res.status(200).json({ message: "Produto atualizado com sucesso" });
            } else {
                const newProduct = new ModelSchemaInstancy({
                    productName,
                    quantity: productQuantity,
                    value: productValue
                });

                await newProduct.save();
                return res.status(201).json({ message: "Produto cadastrado com sucesso", newProduct });
            }
        } catch (error) {

            return res.status(500).json({ message: "Erro interno no servidor" });

        }
    }
    
    async getProductDatas(req, res) {
        try {
            const products = await ModelSchemaInstancy.find();
    
            if (products.length > 0) {
                const productsWithImages = products.map(product => {
                    const productNameFormatted = product.productName.replace(/ /g, "_");
                    const productImagesPath = path.join(__dirname, '../public/product_images');
                    
                    const files = fs.readdirSync(productImagesPath);
                    const productImage = files.find(file => file.startsWith(productNameFormatted));
    
                    const imageUrl = productImage 
                        ? `${req.protocol}://${req.get('host')}/public/product_images/${productImage}` 
                        : null;
    
                    return {
                        ...product._doc,
                        imageUrl
                    };
                });
    
                return res.status(200).json({ message: "Dados de produtos obtidos com êxito!", productsWithImages });
            }
    
        } catch (error) {
            console.error("Erro ao buscar os dados de produtos!", error);
            return res.status(500).json({ message: "Erro ao buscar os dados de produtos!" });
        }
    }
    

}

module.exports = new ProductController;