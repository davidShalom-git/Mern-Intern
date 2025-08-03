require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Import routes - make sure these files exist and are properly exported
let blog, User
try {
    blog = require('./router/Blog')
    User = require('./router/User')
    console.log('Routes imported successfully')
} catch (error) {
    console.error('Error importing routes:', error)
}

// Check environment variables
console.log('Environment check:')
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Set' : 'Missing')
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing')

// Global connection cache
let cachedConnection = null

// MongoDB connection function
const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection')
        return cachedConnection
    }

    try {
        console.log('Creating new MongoDB connection...')
        
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0,
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
        cachedConnection = conn
        return cachedConnection
        
    } catch (error) {
        console.error("MongoDB Connection Error:", error)
        cachedConnection = null
        throw error
    }
}

// CORS middleware - simple and effective
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    
    if (req.method === 'OPTIONS') {
        console.log('Handling preflight request for:', req.path)
        return res.status(200).end()
    }
    
    next()
})

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

// Database connection middleware
const ensureDBConnection = async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        console.error('Database connection failed:', error)
        res.status(503).json({ 
            message: 'Database connection failed. Please try again.',
            error: 'Service temporarily unavailable'
        })
    }
}

// Health check endpoint - MUST come before other routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running successfully!',
        timestamp: new Date().toISOString(),
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
    })
})

// API Routes - only add if imports were successful
if (blog && User) {
    console.log('Setting up API routes...')
    app.use('/api/blog', ensureDBConnection, blog)
    app.use('/api/blog', ensureDBConnection, User)
} else {
    console.error('Routes not available - check router files')
    app.use('/api/*', (req, res) => {
        res.status(500).json({ message: 'Routes not properly configured' })
    })
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    })
})

// 404 handler
app.use('*', (req, res) => {
    console.log('404 - Route not found:', req.originalUrl)
    res.status(404).json({ message: 'Route not found', path: req.originalUrl })
})

// Connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err)
    cachedConnection = null
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB')
    cachedConnection = null
})

module.exports = app

// Local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000
    
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    }).catch(err => {
        console.error('Failed to start server:', err)
        process.exit(1)
    })
}