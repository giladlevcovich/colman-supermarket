// controller/cart.routes.js
const express = require('express');
const router = express.Router();
const Product = require('../../products/models/products.model'); // Adjust path as needed

// Get product by ID
router.get('/add-to-cart/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
