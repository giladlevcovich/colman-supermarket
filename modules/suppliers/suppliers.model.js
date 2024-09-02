const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const supplierSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        }
    },
    address: {
        street: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        }
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    businessType: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Optional: Create a geospatial index on the location field
supplierSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Supplier', supplierSchema);
