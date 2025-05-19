const express = require('express');
const router = express.Router();
const ProductController = require('../controller/ProductController');
const upload = require('../middlewares/multerConfig');

// Rota de cadastro de novos produtos
router.post("/registerProduct", upload.single('image'), (req, res) => ProductController.uploadProductsdata(req, res));
// Rota de busca dos dados de produtos
router.get("/getProductDatas", (req, res) => {ProductController.getProductDatas(req, res)});

module.exports = router;