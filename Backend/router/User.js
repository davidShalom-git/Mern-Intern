const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    const { Name, Email, Password } = req.body

    try {
        console.log('Registration attempt:', { Name, Email, Password: '***' })

        if (!Name || !Email || !Password) {
            return res.status(400).json({ message: "All Fields are Required" })
        }

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables')
            return res.status(500).json({ message: "Server configuration error" })
        }

        console.log('Checking for existing user...')
        const existingUser = await User.findOne({ Email })

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

        const savedUser = await newUser.save()

        if (!savedUser) {
            return res.status(400).json({ message: "Failed to create user" })
        }

        console.log('User created successfully:', savedUser._id)

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(201).json({ message: "User Created Successfully", token })

    } catch (error) {
        console.error('Registration error:', error)
        
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

        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables')
            return res.status(500).json({ message: "Server configuration error" })
        }

        const getUser = await User.findOne({ Email })

        if (!getUser) {
            return res.status(400).json({ message: "User not Found" })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(Password, getUser.Password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(200).json({ message: "User logged in successfully", token })

    } catch (error) {
        console.error('Login error:', error)
        
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