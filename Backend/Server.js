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
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
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

// Manual CORS middleware - MORE AGGRESSIVE APPROACH
app.use((req, res, next) => {
    const allowedOrigins = [
        'https://mernintern2025.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174'
    ]
    
    const origin = req.headers.origin
    console.log('Request origin:', origin)
    
    // Set CORS headers manually
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*')
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://mernintern2025.vercel.app')
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Max-Age', '86400') // 24 hours
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        console.log('Handling preflight request')
        res.status(200).end()
        return
    }
    
    next()
})

// Also use the cors middleware as backup
app.use(cors({
    origin: true, // Allow all origins as fallback
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}))

// Middleware to ensure DB connection
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

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`)
    next()
})

// Routes with DB connection middleware
app.use('/api/blog', ensureDBConnection, blog)
app.use('/api/blog', ensureDBConnection, User)

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running successfully!',
        timestamp: new Date().toISOString(),
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        cors: 'enabled',
        environment: process.env.NODE_ENV || 'development'
    })
})

// Error handling middleware
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

module.exports = app

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