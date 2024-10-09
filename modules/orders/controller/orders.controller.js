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

        // Find the order by ID and populate the productId with name and price
        const order = await Order.findById(orderId).populate('products.productId', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create an array of products with name, price, and quantity
        const productsWithDetails = order.products.map(product => ({
            name: product.productId.name,
            price: product.productId.price,
            quantity: product.quantity
        }));

        res.status(200).json(productsWithDetails);
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
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        // Validate startDate and endDate, if provided
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.date = {};
            if (startDate) {
                dateFilter.date.$gte = new Date(startDate); // Start of the range
            }
            if (endDate) {
                dateFilter.date.$lte = new Date(endDate); // End of the range
            }
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let orders;

        // If the user is an admin, fetch all orders; otherwise, fetch only the user's orders
        if (user.isAdmin) {
            orders = await Order.find(dateFilter)
                .populate('user', 'name')
                .populate('products', 'name price');
        } else {
            orders = await Order.find({ user: userId, ...dateFilter })
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

exports.getOrdersCountByDate = async (req, res) => {
    try {
        const { date } = req.params;

        const [day, month, year] = date.split('-');
        const startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        const endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

        // Find the orders that has been placed on this date
        const ordersCount = await Order.countDocuments({
            date: { $gte: startDate, $lte: endDate }
        });

        res.status(200).json({ date, ordersCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


