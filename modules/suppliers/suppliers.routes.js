
const express = require('express');
const router = express.Router();
const suppliersController = require('./suppliers.controller');

// Define routes
router.get('/suppliers', suppliersController.getAllSuppliers);
router.get('/suppliers/search', suppliersController.searchSuppliers);
router.post('/supplier', suppliersController.createSupplier);
router.get('/supplier/:id', suppliersController.getSupplierById);
router.delete('/supplier/:id', suppliersController.deleteSupplierById);

module.exports = router;
