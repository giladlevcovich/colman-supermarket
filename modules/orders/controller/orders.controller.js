const Order = require('../models/orders.model');

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
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

// Get sum of totalPrice for all orders of a specific user
exports.getTotalPriceByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await Order.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } }, // Match the orders by userId
            {
                $group: {
                    _id: '$user', // Group by user ID
                    totalSpent: { $sum: '$totalPrice' } // Calculate the sum of totalPrice
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found or no orders available for this user' });
        }

        res.status(200).json({ userId, totalSpent: result[0].totalSpent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};