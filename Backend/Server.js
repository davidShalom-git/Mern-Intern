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
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            bufferCommands: false,
            bufferMaxEntries: 0,
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

// Connect to database
connectDB()

// CORS Configuration - FIXED
const corsOptions = {
    origin: [
        'https://mernintern2025.vercel.app', // Your frontend domain
        'http://localhost:3000', // Local development
        'http://localhost:5173', // Vite default port
        'http://localhost:5174', // Alternative Vite port
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 200 // For legacy browser support
}

// Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions))

// Handle preflight requests explicitly
app.options('*', cors(corsOptions))

// Other middleware
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

// Add request timeout middleware
app.use((req, res, next) => {
    req.setTimeout(30000)
    next()
})

// Add logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin')}`)
    next()
})

// Routes
app.use('/api/blog', blog)
app.use('/api/blog', User)

app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running successfully!',
        timestamp: new Date().toISOString(),
        cors: 'enabled'
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

module.exports = app

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}