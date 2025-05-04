const express = require('express');
const menuController = require('../controllers/menuController');
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

router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), menuController.createMenuItem);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), menuController.updateMenuItem);
router.delete('/:id', authMiddleware, adminMiddleware, menuController.deleteMenuItem);

module.exports = router;