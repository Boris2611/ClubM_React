const Rental = require('../models/Rental');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rentals', error });
    }
};

exports.getRentalById = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.status(200).json(rental);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rental', error });
    }
};

exports.createRental = async (req, res) => {
    try {
        let image = '';
        if (req.file) {
            const filename = `rental-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
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
        const { name, description, price, type, availability } = req.body;
        if (!name || !price) return res.status(400).json({ message: 'Naziv i cena su obavezni.' });
        const newRental = new Rental({ name, description, price, type, availability, image });
        await newRental.save();
        res.status(201).json(newRental);
    } catch (error) {
        res.status(500).json({ message: 'Error creating rental', error });
    }
};

exports.updateRental = async (req, res) => {
    const { id } = req.params;
    try {
        let image = req.body.image;
        if (req.file) {
            const filename = `rental-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
            const uploadPath = path.join(__dirname, '../../uploads', filename);
            await sharp(req.file.path)
                .resize(320, 320)
                .jpeg({ quality: 80 })
                .toFile(uploadPath);
            fs.unlinkSync(req.file.path);
            image = `/uploads/${filename}`;
        }
        const { name, description, price, type, availability } = req.body;
        if (!name || !price) return res.status(400).json({ message: 'Naziv i cena su obavezni.' });
        const updatedRental = await Rental.findByIdAndUpdate(
            id,
            { name, description, price, type, availability, image },
            { new: true }
        );
        if (!updatedRental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.status(200).json(updatedRental);
    } catch (error) {
        res.status(500).json({ message: 'Error updating rental', error });
    }
};

exports.deleteRental = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRental = await Rental.findByIdAndDelete(id);
        if (!deletedRental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rental', error });
    }
};