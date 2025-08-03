require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const blog = require('./router/Blog')
const User = require('./router/User')

// Check environment variables
console.log('Environment check:')
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Set' : 'Missing')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing')

mongoose.connect(process.env.MONGODB_URL).then((res) => {
    console.log("MongoDB Connected..")
}).catch((error) => {
    console.log("MongoDB Error", error)
})

app.use(cors())
app.use(bodyParser.json())

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

app.use('/api/blog', blog);
app.use('/api/blog', User);

app.get('/', (req, res) => {
    res.json({ message: 'API is running successfully!' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}