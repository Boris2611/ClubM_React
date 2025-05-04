const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);