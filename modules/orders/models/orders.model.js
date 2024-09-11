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
        _id: false, // מונע יצירת מזהה ייחודי עבור כל מוצר
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            validate: {
                validator: async function(value) {
                    const productExists = await Product.exists({ _id: value });
                    return productExists;
                },
                message: 'מזהה מוצר אחד או יותר לא קיימים במסד הנתונים'
            }
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'כמות חייבת להיות לפחות 1']
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

// orderSchema.pre('save', async function(next) {
//     const productPrices = await Product.find({ _id: { $in: this.products } }).select('price');
//     this.totalPrice = productPrices.reduce((total, product) => total + product.price, 0);
//     next();
// });

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