const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        required: true,
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
