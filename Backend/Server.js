require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const blog = require('./router/Blog')
const User = require('./router/User')


mongoose.connect(process.env.MONGODB_URL).then((res)=> {
    console.log("MongoDB Connected..")
}).catch((error)=> {
    console.log("MongoDB Error",error)
})




app.use(cors())
app.use(bodyParser.json())


app.use('/api/blog',blog);
app.use('/api/blog',User);



app.listen(2000,()=> {
    console.log("Server Connected.....")
})