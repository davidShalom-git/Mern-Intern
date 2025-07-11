const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const { storage } = require('../config/cloudinary')
const multer = require('multer');

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
})

router.post('/upload', upload.single('Image'), async (req, res) => {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    try {
        const { Title, Topic, Content } = req.body;

        // Validate required fields
        if (!Title || !Topic || !Content) {
            return res.status(400).json({ 
                message: "Title, Topic, and Content are required",
                received: { Title, Topic, Content }
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ 
                message: "Image file is required" 
            });
        }

        // Check if file was successfully uploaded to Cloudinary
        if (!req.file.path) {
            return res.status(400).json({ 
                message: "Failed to upload image to Cloudinary" 
            });
        }

        // Create blog post
        const blog = new Blog({
            Title,
            Topic,
            Content,
            Image: req.file.path, // Cloudinary URL
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
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
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
        if (!Author || !req.file) {
            return res.json({ message: "All Fields are required.." })
        }

        const blog = new Blog({

            Author,
            AuthorImage: req.file.path, 
        })

        const Author = await blog.save()
        if (!Author) {
            return res.status(404).json({ message: "Author Details are not available" })
        }

        res.status(201).json({ "message": "Success", Author })

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

        res.status(200).json({ message: "Success", getBlogs })

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


router.get('/get:id', async (req, res) => {
    try {

        const id = req.params;

        const getSingleBlog = await Blog.find(id)
        if (!getSingleBlog) {
            return res.status(404).json({ message: "No Blogs" })
        }

        res.status(200).json({ message: "Success", getSingleBlog })
    }

    catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


module.exports = router;
