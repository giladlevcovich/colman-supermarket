const Supplier = require('./suppliers.model');


exports.createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        const savedSupplier = await supplier.save();
        res.status(201).json(savedSupplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplierId = async (req, res) => {
    try{
        const supplierId = req.params.supplierId;
        const updateData = req.body;
        // Update the supplier with the given ID
        const updatedSupplier = await Supplier.findByIdAndUpdate(supplierId, updateData, { new: true });
        if (!updatedSupplier) {
            return res.status(404).json({ message: `Supplier ${supplierId} not found` });
        }
        res.status(200).json({ message: `Supplier ${supplierId} updated successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
