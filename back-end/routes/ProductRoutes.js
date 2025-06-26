const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const upload = require('../middlewares/multerConfig');
const adminAuth = require('../middlewares/adminValidation');

// Rota de cadastro de novos produtos
router.post("/registerProduct", upload.single('image'), (req, res) => ProductController.uploadProductsdata(req, res));
// Rota de busca dos dados de produtos
router.get("/getProductDatas", (req, res) => {ProductController.getProductDatas(req, res)});
router.put("/stock/:id", adminAuth, (req, res) => {ProductController.updateStock(req, res)});

module.exports = router;