const express = require('express');
const { getSales, createSale, updateSale, deleteSale, orderSale } = require('../controllers/salesController');
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

router.get('/', getSales);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createSale);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateSale);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSale);
router.post('/:id/order', authMiddleware, orderSale);

module.exports = router;