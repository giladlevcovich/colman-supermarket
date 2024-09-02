const mongoose = require('mongoose');
const { Schema } = mongoose;

const Supplier = require('../../suppliers/suppliers.model');
const productSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'suppliers',
        required: true,
        validate: {
            validator: async function(value) {
                const supplierExists = await Supplier.exists({ _id: value });
                return supplierExists;
            },
            message: 'The supplier ID does not exist in the database'
        }
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    isKosher: {
        type: Boolean,
        required: true,
    },
    containsGluten: {
        type: Boolean,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});


const ProductsModel = mongoose.model('Product', productSchema);
module.exports = ProductsModel;
