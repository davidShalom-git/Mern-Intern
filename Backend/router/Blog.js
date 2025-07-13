const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const { storage } = require('../config/cloudinary')
const multer = require('multer');

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 4 // Explicit max file count
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
})

// Updated route to handle multiple images
router.post('/upload', upload.array('Images', 4), async (req, res) => {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    try {
        const { Title, Topic, Content } = req.body;

        // Validate required fields
        if (!Title || !Topic || !Content) {
            return res.status(400).json({
                message: "Title, Topic, and Content are required",
                received: { Title, Topic, Content }
            });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one image file is required"
            });
        }

        // Process uploaded images
        const images = req.files.map((file, index) => ({
            url: file.path, // Cloudinary URL
            alt: `${Title} - Image ${index + 1}`,
            isPrimary: index === 0 // First image is primary
        }));

        // Create blog post
        const blog = new Blog({
            Title,
            Topic,
            Content,
            Images: images,
            Image: images[0].url, // Keep backward compatibility
        });

        const newBlog = await blog.save();

        if (!newBlog) {
            return res.status(500).json({
                message: "Failed to save blog to database"
            });
        }

        res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog
        });

    } catch (error) {
        console.error('Upload error details:', error);

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                details: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate entry error",
                details: error.message
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 10 MB.' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Too many files. Maximum 4 images allowed.' });
        }
        return res.status(400).json({ message: error.message });
    }

    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ message: error.message });
    }

    next(error);
});

router.post('/profile', upload.single('Image'), async (req, res) => {
    try {
        const { Author } = req.body; // Fixed: Author should be from req.body

        if (!Author || !req.file) {
            return res.json({ message: "All Fields are required.." })
        }

        const blog = new Blog({
            Author,
            AuthorImage: req.file.path,
        })

        const savedAuthor = await blog.save(); // Fixed: renamed variable
        if (!savedAuthor) {
            return res.status(404).json({ message: "Author Details are not available" })
        }

        res.status(201).json({ "message": "Success", Author: savedAuthor })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get('/get', async (req, res) => {
    try {
        const getBlogs = await Blog.find({})
        if (!getBlogs) {
            return res.status(404).json({ message: "No Blogs" })
        }

        res.status(200).json(getBlogs)

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const getSingleBlog = await Blog.findById(id);
        if (!getSingleBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ getSingleBlog });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;