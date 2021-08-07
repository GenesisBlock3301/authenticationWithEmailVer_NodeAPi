const express = require('express')
const app = express()
// const bodyParser = require('bod')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();


//connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser: true,
    useUnifiedTopology: true },
    () => console.log("connected to db"))

//middleware
app.use(express.json())

// import routes
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')


//routes middleware
app.use('/api/user', authRoute)
app.use('/api/user', postsRoute)

app.listen(3000, () => console.log("Up and running and port is 3000"))