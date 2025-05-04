const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Importuj rute
const menuRoutes = require('./routes/menuRoutes');
const feedRoutes = require('./routes/feedRoutes');
const userRoutes = require('./routes/userRoutes');
const salesRoutes = require('./routes/salesRoutes');
const authRoutes = require('./routes/authRoutes');
const rentalsRoutes = require('./routes/rentalsRoutes');

app.use('/api/menu', menuRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalsRoutes);

module.exports = app;