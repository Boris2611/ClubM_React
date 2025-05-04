const Sale = require('../models/Sale');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Dohvati sve proizvode za prodaju
exports.getSales = async (req, res) => {
  const items = await Sale.find().sort({ createdAt: -1 });
  res.json(items);
};

// Dodaj novi proizvod (admin)
exports.createSale = async (req, res) => {
  try {
    let image = '';
    if (req.file) {
      const filename = `sale-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const uploadPath = path.join(__dirname, '../../uploads', filename);
      await sharp(req.file.path)
        .resize(320, 320)
        .jpeg({ quality: 80 })
        .toFile(uploadPath);
      fs.unlinkSync(req.file.path);
      image = `/uploads/${filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }
    const { name, description, price } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Naziv i cena su obavezni.' });
    const item = new Sale({ name, description, price, image });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dodavanju proizvoda' });
  }
};

// Izmeni proizvod (admin)
exports.updateSale = async (req, res) => {
  try {
    let image = req.body.image;
    if (req.file) {
      const filename = `sale-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const uploadPath = path.join(__dirname, '../../uploads', filename);
      await sharp(req.file.path)
        .resize(320, 320)
        .jpeg({ quality: 80 })
        .toFile(uploadPath);
      fs.unlinkSync(req.file.path);
      image = `/uploads/${filename}`;
    }
    const { name, description, price } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Naziv i cena su obavezni.' });
    const item = await Sale.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri izmeni proizvoda' });
  }
};

// Obriši proizvod (admin)
exports.deleteSale = async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id);
  res.json({ message: 'Obrisano' });
};

// Naruči proizvod (ulogovani korisnik)
exports.orderSale = async (req, res) => {
  // Ovde možeš sačuvati narudžbinu u posebnu kolekciju ili poslati email, itd.
  // Za primer, samo šaljemo poruku:
  res.json({ message: 'Narudžbina uspešno poslata!' });
};