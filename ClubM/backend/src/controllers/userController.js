const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

exports.getProfile = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    description: req.user.description,
    role: req.user.role
  });
};

exports.updateProfile = async (req, res) => {
  try {
    let avatar = req.user.avatar;
    if (req.file) {
      // Novi naziv fajla sa ekstenzijom .jpg
      const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
      const uploadPath = path.join(__dirname, '../../uploads', filename);

         // Resize na 320x320px, kvalitet 80
         await sharp(req.file.path)
         .resize(320, 320)
         .jpeg({ quality: 80 })
         .toFile(uploadPath);

      fs.unlinkSync(req.file.path);

      avatar = `/uploads/${filename}`;
      req.user.avatar = avatar;
    }
    if (req.body.name) req.user.name = req.body.name;
    if (req.body.description !== undefined) req.user.description = req.body.description;
    await req.user.save();
    res.json({
      avatar: req.user.avatar,
      name: req.user.name,
      description: req.user.description
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.getProfileById = async (req, res) => {
    try {
      const user = await require('../models/User').findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Korisnik nije pronađen' });
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        description: user.description,
        role: user.role
      });
    } catch (err) {
      res.status(500).json({ message: 'Greška pri dohvatanju profila' });
    }
  };