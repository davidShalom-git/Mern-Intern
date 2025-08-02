require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Enhanced MongoDB connection with proper error handling and timeouts
const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 60000, // 60 seconds
            socketTimeoutMS: 60000,  // 60 seconds
            serverSelectionTimeoutMS: 60000, // 60 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering commands
            retryWrites: true,
            w: 'majority'
        };

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL, options);
        console.log("✅ MongoDB Connected Successfully!");
        
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        
        // Log specific error details
        if (error.name === 'MongoNetworkTimeoutError') {
            console.error("🔥 Network timeout - Check your internet connection and MongoDB Atlas network access");
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error("🔥 Server selection error - Check IP whitelist in MongoDB Atlas");
        }
        
        // Don't exit in production, but log the error
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('🔹 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
});

// Initialize database connection
connectDB();

// CORS configuration - more specific for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com', 'https://your-vercel-app.vercel.app'] 
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser with size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            database: dbStatus,
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            error: error.message 
        });
    }
});

// SOLUTION 1: Try-catch wrapper for router imports to identify problematic routes
console.log('Loading routes...');
try {
    console.log('Loading blog routes...');
    const blog = require('./router/Blog');
    app.use('/api/blog', blog);
    console.log('✅ Blog routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading blog routes:', error.message);
    console.error('Stack:', error.stack);
}

try {
    console.log('Loading user routes...');
    const User = require('./router/User');
    app.use('/api/user', User);
    console.log('✅ User routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading user routes:', error.message);
    console.error('Stack:', error.stack);
}

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Blog API is running successfully!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message,
        timestamp: new Date().toISOString()
    });
});

module.exports = app;

// Start server only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}