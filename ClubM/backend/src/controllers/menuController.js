const Menu = require('../models/Menu');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.getAllMenuItems = async (req, res) => {
  const items = await Menu.find().sort({ createdAt: -1 });
  res.json(items);
};

exports.getMenuItemById = async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Nije pronađeno' });
  res.json(item);
};

exports.createMenuItem = async (req, res) => {
  try {
    let image = '';
    if (req.file) {
      const filename = `menu-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
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
    const { name, description, price, category } = req.body;
    if (!name || !price || !category) return res.status(400).json({ message: 'Naziv, cena i kategorija su obavezni.' });
    const item = new Menu({ name, description, price, image, category });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dodavanju proizvoda' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    let image = req.body.image;
    if (req.file) {
      const filename = `menu-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const uploadPath = path.join(__dirname, '../../uploads', filename);
      await sharp(req.file.path)
        .resize(320, 320)
        .jpeg({ quality: 80 })
        .toFile(uploadPath);
      fs.unlinkSync(req.file.path);
      image = `/uploads/${filename}`;
    }
    const { name, description, price, category } = req.body;
    if (!name || !price || !category) return res.status(400).json({ message: 'Naziv, cena i kategorija su obavezni.' });
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri izmeni proizvoda' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ message: 'Obrisano' });
};