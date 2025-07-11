const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



router.post('/register',async(req,res)=> {
    const {Name,Email,Password} = req.body

    try {

        if(!Name || !Email || !Password){
            return res.status(400).json({message: "All Fields are Required"})
        }

        const exisitingUser = await User.findOne({Email})

        if(exisitingUser){
            return res.status(404).json({message: "Email Already Exists"})
        }

        const hashPassword = await bcrypt.hash(Password,10)

        const Users = new User({
            Name,
            Email,
            Password: hashPassword
        })

        console.log(Name)
        console.log(Email)
        console.log(Password)

        const users = await Users.save()
        if(!users){
            return res.status(400).json({message: "No User Created"})
        }
        console.log(users);

        const token = jwt.sign({id: users._id},process.env.JWT_SECRET,{expiresIn: '30d'})

        res.status(201).json({message: "User Created Successfully",token})
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})


router.post('/login', async(req,res)=> {
    const {Email,Password} = req.body

    try {

        if(!Email || !Password){
            return res.status(400).json({message: "All fields are required"})
        }

        const getUser = await User.findOne({Email})
        if(!getUser){
            return res.status(400).json({message: "User not Found"})
        }

         const token = jwt.sign({id: getUser._id},process.env.JWT_SECRET,{expiresIn: '30d'})

        res.status(200).json({message: "User loggged",token})
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }

})

router.post('/logout',(req,res)=> {
    res.status(200).json({message: "User logged Out....."})
})

module.exports = router;