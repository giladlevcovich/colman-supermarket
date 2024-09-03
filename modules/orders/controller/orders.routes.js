const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');

router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrderById);
router.delete('/orders/:id', orderController.deleteOrderById);
router.get('/orders/total-price/:userId', orderController.getTotalPriceByUserId);

module.exports = router;