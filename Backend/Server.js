require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const blog = require('./router/Blog')
const User = require('./router/User')

// MongoDB connection with proper configuration for serverless
const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            console.log('Already connected to MongoDB')
            return
        }

        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

// Connect to database
connectDB()

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected')
})

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Add request timeout middleware
app.use((req, res, next) => {
    req.setTimeout(30000) // 30 second timeout
    next()
})

// Routes
app.use('/api/blog', blog)
app.use('/api/blog', User)

app.get('/', (req, res) => {
    res.json({ message: 'API is running successfully!' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    })
})

module.exports = app

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}