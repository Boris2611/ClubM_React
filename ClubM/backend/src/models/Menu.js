const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: {
    type: String,
    enum: ['kafa', 'caj', 'pivo', 'zestina', 'vino', 'sokovi', 'voda', 'ostalo'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);