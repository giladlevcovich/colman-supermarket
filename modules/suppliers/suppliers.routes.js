
const express = require('express');
const router = express.Router();
const productController = require('./suppliers.controller');

// Define routes
router.get('/suppliers', productController.getAllSuppliers);
router.post('/supplier', productController.createSupplier);
router.get('/supplier/:id', productController.getSupplierById);
router.delete('/supplier/:id', productController.deleteSupplierById);
router.put('/updateSupplier/:supplierId', productController.updateSupplierId);
// TODO: implement the add supplier route

module.exports = router;
