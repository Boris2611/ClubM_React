const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Dohvati sve objave (najnovije prve)
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name avatar role')
            .populate('comments.user', 'name avatar role')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Kreiraj novu objavu (slika je opciona, resize na 320x320)
exports.createPost = async (req, res) => {
    try {
        let image = '';
        if (req.file) {
            const filename = `post-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
            const uploadPath = path.join(__dirname, '../../uploads', filename);

            await sharp(req.file.path)
                .resize(1080, 1080, { fit: 'inside' })
                .jpeg({ quality: 40 })
                .toFile(uploadPath);

            fs.unlinkSync(req.file.path);

            image = `/uploads/${filename}`;
        } else if (req.body.image) {
            image = req.body.image;
        }
        if (!req.body.description) {
            return res.status(400).json({ message: 'Opis je obavezan.' });
        }
        const newPost = new Post({
            author: req.user._id || req.user.id,
            image,
            description: req.body.description,
            likes: [],
            comments: []
        });
        const savedPost = await newPost.save();
        const populatedPost = await Post.findById(savedPost._id)
            .populate('author', 'name avatar role')
            .populate('comments.user', 'name avatar role');
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error });
    }
};

// Lajkuj/odlajkuj objavu
exports.likePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userId = req.user.id;
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }
        await post.save();
        res.status(200).json({ likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error });
    }
};

// Komentariši objavu
exports.commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ user: req.user.id, text: comment, createdAt: new Date() });
        await post.save();
        const populatedPost = await Post.findById(id)
            .populate('author', 'name avatar role')
            .populate('comments.user', 'name avatar role');
        res.status(200).json(populatedPost.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error commenting on post', error });
    }
};

// Izmeni objavu
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Nije dozvoljeno' });
        }
        post.description = req.body.description || post.description;
        post.image = req.body.image !== undefined ? req.body.image : post.image;
        await post.save();
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'name avatar role')
            .populate('comments.user', 'name avatar role');
        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri izmeni objave', error });
    }
};

// Obriši objavu
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Dozvoli brisanje ako je autor ili admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Nije dozvoljeno' });
        }
        await post.deleteOne();
        res.json({ message: 'Objava obrisana' });
    } catch (error) {
        res.status(500).json({ message: 'Greška pri brisanju objave', error });
    }
};