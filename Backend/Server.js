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

// Global connection cache for serverless
let cachedConnection = null

// MongoDB connection function with proper serverless handling
const connectDB = async () => {
    // If we have a cached connection and it's connected, use it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection')
        return cachedConnection
    }

    try {
        console.log('Creating new MongoDB connection...')
        
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
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

// Middleware to ensure DB connection before processing requests
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

// CORS configuration for your specific domains
const corsOptions = {
    origin: [
        'https://mernintern2025.vercel.app', // Your frontend domain
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200
}

// Apply CORS
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

// Add request logging for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

// Apply database connection middleware to API routes
app.use('/api/blog', ensureDBConnection, blog)
app.use('/api/blog', ensureDBConnection, User)

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running successfully!',
        timestamp: new Date().toISOString(),
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
    })
})

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    })
})

// Handle 404s
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
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

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...')
    await mongoose.connection.close()
    process.exit(0)
})

module.exports = app

// Local development server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000
    
    // Connect to DB first, then start server
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    }).catch(err => {
        console.error('Failed to start server:', err)
        process.exit(1)
    })
}