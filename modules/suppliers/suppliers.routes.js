
const express = require('express');
const router = express.Router();
const productController = require('./suppliers.controller');

// Define routes
router.post('/supplier', productController.createSupplier);
router.get('/suppliers', productController.getAllSuppliers);
router.get('/suppliers/:id', productController.getSupplierById);
router.put('/suppliers/:id', productController.updateSupplierById);
router.delete('/suppliers/:id', productController.deleteSupplierById);
// TODO: implement the add supplier route

module.exports = router;
