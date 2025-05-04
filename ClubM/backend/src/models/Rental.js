const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['short-term', 'long-term'],
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);