const Product = require('../models/products.model');


exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const { supplier, name, minPrice, maxPrice, isKosher, containsGluten } = req.query;

        const priceFilter = {};
        if (minPrice) priceFilter.$gte = minPrice;
        if (maxPrice) priceFilter.$lte = maxPrice;

        const query = {
            ...(supplier && { supplier }),
            ...(name && { name: new RegExp(name, 'i') }),
            ...(Object.keys(priceFilter).length && { price: priceFilter }),
            ...(isKosher !== undefined && { isKosher: isKosher === 'true' }),
            ...(containsGluten !== undefined && { containsGluten: containsGluten === 'true' }),
        };

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateField = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: updateField },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
