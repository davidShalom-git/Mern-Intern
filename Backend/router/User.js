const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// Helper function to check database connection
const ensureConnection = async () => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error('Database not connected')
    }
}

router.post('/register', async (req, res) => {
    const { Name, Email, Password } = req.body

    try {
        console.log('Registration attempt:', { Name, Email, Password: '***' })

        // Check database connection
        await ensureConnection()

        if (!Name || !Email || !Password) {
            return res.status(400).json({ message: "All Fields are Required" })
        }

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables')
            return res.status(500).json({ message: "Server configuration error" })
        }

        console.log('Checking for existing user...')
        
        // Add timeout to database operations
        const existingUser = await Promise.race([
            User.findOne({ Email }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database query timeout')), 8000)
            )
        ])

        if (existingUser) {
            return res.status(409).json({ message: "Email Already Exists" })
        }

        console.log('Hashing password...')
        const hashPassword = await bcrypt.hash(Password, 10)

        console.log('Creating new user...')
        const newUser = new User({
            Name,
            Email,
            Password: hashPassword
        })

        // Save user with timeout
        const savedUser = await Promise.race([
            newUser.save(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database save timeout')), 8000)
            )
        ])

        if (!savedUser) {
            return res.status(400).json({ message: "Failed to create user" })
        }

        console.log('User created successfully:', savedUser._id)

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(201).json({ message: "User Created Successfully", token })

    } catch (error) {
        console.error('Registration error:', error)
        
        if (error.message.includes('timeout')) {
            return res.status(504).json({ message: "Database operation timed out. Please try again." })
        }
        
        if (error.name === 'MongooseError' || error.name === 'MongoError') {
            return res.status(503).json({ message: "Database connection error. Please try again." })
        }
        
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
        })
    }
})

router.post('/login', async (req, res) => {
    const { Email, Password } = req.body

    try {
        console.log('Login attempt for email:', Email)

        // Check database connection
        await ensureConnection()

        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables')
            return res.status(500).json({ message: "Server configuration error" })
        }

        // Find user with timeout
        const getUser = await Promise.race([
            User.findOne({ Email }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database query timeout')), 8000)
            )
        ])

        if (!getUser) {
            return res.status(400).json({ message: "User not Found" })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(Password, getUser.Password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(200).json({ message: "User logged in", token })

    } catch (error) {
        console.error('Login error:', error)
        
        if (error.message.includes('timeout')) {
            return res.status(504).json({ message: "Database operation timed out. Please try again." })
        }
        
        if (error.name === 'MongooseError' || error.name === 'MongoError') {
            return res.status(503).json({ message: "Database connection error. Please try again." })
        }
        
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Login failed'
        })
    }
})

router.post('/logout', (req, res) => {
    res.status(200).json({ message: "User logged out successfully" })
})

module.exports = router