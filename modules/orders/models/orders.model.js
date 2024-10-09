const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('../../products/models/products.model');
const User = require('../../users/models/users.model');

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                const userExists = await User.exists({ _id: value });
                return userExists;
            },
            message: 'The user ID does not exist in the database'
        }
    },
    products: [{
        _id: false,
        productId: {
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
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        }
    }],
    totalPrice: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

orderSchema.pre('save', async function(next) {
    const productsInCart = this.products;
    let total = 0;

    for (let item of productsInCart) {
        const product = await Product.findById(item.productId).select('price');
        if (product) {
            total += product.price * item.quantity;
        }
    }

    this.totalPrice = total;
    next();
});

const OrdersModel = mongoose.model('Order', orderSchema);
module.exports = OrdersModel;