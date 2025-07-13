const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        trim: true
    },
    Topic: {
        type: String,
        required: true,
        trim: true
    },
    Content: {
        type: String,
        required: true
    },
    Images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    // Keep the old Image field for backward compatibility (optional)
    Image: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);