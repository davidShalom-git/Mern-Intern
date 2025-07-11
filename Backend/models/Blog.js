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
    Image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);