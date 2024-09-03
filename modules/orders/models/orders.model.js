const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('../../products/models/products.model');
const User = require('../../users/models/users.model');

const orderSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        // validate: {
        //     validator: async function(value) {
        //         const userExists = await User.exists({ _id: value });
        //         return userExists;
        //     },
        //     message: 'The user ID does not exist in the database'
        // }
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        validate: {
            validator: async function(value) {
                const productExists = await Product.exists({ _id: value });
                return productExists;
            },
            message: 'One or more product IDs do not exist in the database'
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

orderSchema.pre('save', async function(next) {
    const productPrices = await Product.find({ _id: { $in: this.products } }).select('price');
    this.totalPrice = productPrices.reduce((total, product) => total + product.price, 0);
    next();
});

const OrdersModel = mongoose.model('Order', orderSchema);
module.exports = OrdersModel;