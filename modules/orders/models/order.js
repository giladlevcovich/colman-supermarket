const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderID: {
        type: Schema.Types.ObjectID,
        required: true,
        auto: true
     },
    customerID: {
        type: String,
        required: true
     },
    totalPrice: {
        type: Number,
        required: true
     },
    listOfProducts: [{ 
        type: String,
        required: true
     }],
    orderDate: {
        type: Date,
        default: Date.now
     }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;