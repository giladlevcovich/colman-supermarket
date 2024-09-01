
const express = require('express');
const router = express.Router();
const productController = require('./products.controller');

// Define routes
router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProductById);
router.delete('/products/:id', productController.deleteProductById);


module.exports = router;
