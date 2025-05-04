const express = require('express');
const { createPost } = require('../controllers/adminController'); // Preimenovati ako je potrebno
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/posts', authMiddleware, createPost); // Svi korisnici mogu objavljivati

module.exports = router;