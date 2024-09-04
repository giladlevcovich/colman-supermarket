const mongoose = require('mongoose');
const Order = require('../models/orders.model');
const User = require('../../users/models/users.model');

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save({ runValidators: true });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name').populate('products', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name').populate('products', 'name price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductsByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID and populate the products
        const order = await Order.findById(orderId).populate('products', 'name price');

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Return the products of the order
        res.status(200).json(order.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate('user', 'name').populate('products', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteOrderById = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let orders;

        if (user.isAdmin) {
            orders = await Order.find({})
                .populate('user', 'name')
                .populate('products', 'name price');
        } else {
            orders = await Order.find({ user: req.params.userId })
                .populate('user', 'name')
                .populate('products', 'name price');
        }

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get sum of totalPrice for all orders of a specific user
exports.getTotalPriceByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await Order.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalPrice' }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json({ userId, totalSpent: result[0].totalSpent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
