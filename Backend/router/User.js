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

        const existingUser = await User.findOne({ Email })

        if (existingUser) {
            return res.status(409).json({ message: "Email Already Exists" }) // Changed from 404 to 409
        }

        const hashPassword = await bcrypt.hash(Password, 10)

        const Users = new User({
            Name,
            Email,
            Password: hashPassword
        })

        console.log('Creating user with data:', { Name, Email })

        const users = await Users.save()
        if (!users) {
            return res.status(400).json({ message: "No User Created" })
        }
        console.log('User created successfully:', users._id)

        const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(201).json({ message: "User Created Successfully", token })

    } catch (error) {
        console.error('Registration error:', error) // Log the actual error
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { Email, Password } = req.body

    try {
        console.log('Login attempt for email:', Email)

        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if JWT_SECRET exists
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

        res.status(200).json({ message: "User logged in", token })

    } catch (error) {
        console.error('Login error:', error) // Log the actual error
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})

router.post('/logout', (req, res) => {
    res.status(200).json({ message: "User logged Out....." })
})

module.exports = router;