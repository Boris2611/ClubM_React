const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

// Configure multer for file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for handling file uploads
const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'File upload failed' });
        }
        next();
    });
};

// Middleware for uploading to Cloudinary
const cloudinaryUpload = async (req, res, next) => {
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    return res.status(500).json({ error: 'Cloudinary upload failed' });
                }
                req.fileUrl = result.secure_url;
                next();
            });
            req.file.stream.pipe(result);
        } catch (error) {
            return res.status(500).json({ error: 'Cloudinary upload failed' });
        }
    } else {
        next();
    }
};

module.exports = {
    uploadMiddleware,
    cloudinaryUpload,
};