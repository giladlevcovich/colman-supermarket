const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { orderID, customerID, totalPrice, listOfProducts } = req.body;
        
        const newOrder = new Order({
            orderID,
            customerID,
            totalPrice,
            listOfProducts,
            orderDate: new Date()
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ orderID: id });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalPrice, listOfProducts } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { orderID: id },
            { totalPrice, listOfProducts },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await Order.findOneAndDelete({ orderID: id });

        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};
