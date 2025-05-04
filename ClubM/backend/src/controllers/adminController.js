const Post = require('../models/Post');
const Menu = require('../models/Menu');
const User = require('../models/User');

// Kreiraj novu objavu
exports.createPost = async (req, res) => {
    try {
        const newPost = new Post({
            author: req.user.id, // Svi korisnici mogu da objavljuju
            image: req.file ? req.file.path : null,
            description: req.body.description,
            likes: [],
            comments: []
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Obriši objavu
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};

// Upravljanje menijem (dodaj/izmeni/obriši)
exports.manageMenu = async (req, res) => {
    try {
        const { action, menuItem } = req.body;
        if (action === 'add') {
            const newMenuItem = new Menu(menuItem);
            await newMenuItem.save();
            return res.status(201).json(newMenuItem);
        } else if (action === 'update') {
            const updatedMenuItem = await Menu.findByIdAndUpdate(menuItem.id, menuItem, { new: true });
            return res.status(200).json(updatedMenuItem);
        } else if (action === 'delete') {
            await Menu.findByIdAndDelete(menuItem.id);
            return res.status(200).json({ message: 'Menu item deleted successfully' });
        }
        res.status(400).json({ message: 'Invalid action' });
    } catch (error) {
        res.status(500).json({ message: 'Error managing menu', error });
    }
};

// Dohvati podatke za admin panel (npr. sve korisnike i narudžbine)
exports.getAdminData = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin data', error });
    }
};