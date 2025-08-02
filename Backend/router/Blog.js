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

// FIXED: Error handler middleware should be placed after all routes
// Move this to the end of the file

// POST route for uploading blogs
router.post('/upload', upload.fields([
    { name: 'AuthorImage', maxCount: 1 },
    { name: 'Images', maxCount: 4 }
]), async (req, res) => {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    try {
        const { Title, Topic, Content, Author } = req.body;

        // Updated validation - AuthorImage is now optional
        if (!Title || !Topic || !Content || !Author) {
            return res.status(400).json({
                message: "Title, Topic, Content, and Author are required",
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

        // Handle AuthorImage - use default if none provided
        let authorImagePath;
        if (req.files['AuthorImage'] && req.files['AuthorImage'][0]) {
            authorImagePath = req.files['AuthorImage'][0].path;
        } else {
            // Use default image URL
            authorImagePath = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';
        }

        const blog = new Blog({
            Title,
            Topic,
            Content,
            Author,
            AuthorImage: authorImagePath,
            Images: images,
            Image: images[0].url
        });

        const newBlog = await blog.save();

        if (!newBlog) {
            return res.status(500).json({ message: "Failed to save blog to database" });
        }

        res.status(201).json({
            message: "Blog created successfully",
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

// GET route for all blogs
router.get('/', async (req, res) => {  // FIXED: Changed from '/get' to '/'
    try {
        const getBlogs = await Blog.find({})
        if (!getBlogs || getBlogs.length === 0) {
            return res.status(404).json({ message: "No Blogs found" })
        }

        res.status(200).json({
            message: "Blogs retrieved successfully",
            count: getBlogs.length,
            blogs: getBlogs
        })

    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

// FIXED: More specific route should come after general routes
// GET route for single blog by ID
router.get('/:id', async (req, res) => {  // FIXED: Changed from '/get/:id' to '/:id'
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid blog ID format" });
        }

        const getSingleBlog = await Blog.findById(id);
        if (!getSingleBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ 
            message: "Blog retrieved successfully",
            blog: getSingleBlog 
        });
    } catch (error) {
        console.error('Get single blog error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// PUT route for updating blog
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid blog ID format" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE route for deleting blog
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid blog ID format" });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog deleted successfully",
            blog: deletedBlog
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// FIXED: Multer error handler middleware moved to the end
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

module.exports = router;