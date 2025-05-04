const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { updateProfile, getProfile, getProfileById } = require('../controllers/userController');

// Multer storage sa ekstenzijom
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.get('/profile/:id', getProfileById); // <-- dodaj ovu liniju

module.exports = router;