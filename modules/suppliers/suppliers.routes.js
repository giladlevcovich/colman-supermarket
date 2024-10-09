
const express = require('express');
const router = express.Router();
const suppliersController = require('./suppliers.controller');

router.get('/suppliers', suppliersController.getAllSuppliers);
router.post('/supplier', suppliersController.createSupplier);
router.get('/supplier/:id', suppliersController.getSupplierById);
router.delete('/supplier/:id', suppliersController.deleteSupplierById);
router.put('/updateSupplier/:supplierId', suppliersController.updateSupplierId);


module.exports = router;
