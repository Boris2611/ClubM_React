const express = require('express');
const { getAllRentals, getRentalById, createRental, updateRental, deleteRental } = require('../controllers/rentalsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', getAllRentals);
router.get('/:id', getRentalById);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createRental);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateRental);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRental);

module.exports = router;