const express = require('express');
const router = express.Router();
const orderController = require('../controller/orders.controller');

router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.get('/orders/user-orders/:userId', orderController.getOrdersByUserId );
router.put('/orders/:id', orderController.updateOrderById);
router.delete('/orders/:id', orderController.deleteOrderById);
router.get('/orders/total-price/:userId', orderController.getTotalPriceByUserId);
router.get('/orders/:orderId/products', orderController.getProductsByOrderId);
router.get('/orders/count/:date', orderController.getOrdersCountByDate);

module.exports = router;