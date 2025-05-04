const express = require('express');
const {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    commentOnPost
} = require('../controllers/feedController');
const auth = require('../middleware/authMiddleware');
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

router.get('/', getPosts);
// Dodaj upload.single('image') za upload slike
router.post('/', auth, upload.single('image'), createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentOnPost);

module.exports = router;