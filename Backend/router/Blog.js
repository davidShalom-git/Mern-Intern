const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const { storage } = require('../config/cloudinary')
const multer = require('multer')

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 5 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.post('/upload', upload.fields([
    { name: 'AuthorImage', maxCount: 1 },
    { name: 'Images', maxCount: 4 }
]), async (req, res) => {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    try {
        const { Title, Topic, Content, Author } = req.body;

        if (!Title || !Topic || !Content || !Author || !req.files['AuthorImage']) {
            return res.status(400).json({
                message: "Title, Topic, Content, Author, and AuthorImage are required",
                received: { Title, Topic, Content, Author }
            });
        }

        const blogImages = req.files['Images'] || [];
        if (blogImages.length === 0) {
            return res.status(400).json({
                message: "At least one blog image file is required"
            });
        }

        const images = blogImages.map((file, index) => ({
            url: file.path,
            alt: `${Title} - Image ${index + 1}`,
            isPrimary: index === 0
        }));

        const blog = new Blog({
            Title,
            Topic,
            Content,
            Author,
            AuthorImage: req.files['AuthorImage'][0].path,
            Images: images,
            Image: images[0].url
        });

        const newBlog = await blog.save();

        if (!newBlog) {
            return res.status(500).json({ message: "Failed to save blog to database" });
        }

        res.status(201).json({
            message: "Blog with author created successfully",
            blog: newBlog
        });

    } catch (error) {
        console.error('Upload error details:', error);

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