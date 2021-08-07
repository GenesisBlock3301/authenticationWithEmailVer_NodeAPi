const express = require('express')
const app = express()
const nodemailer = require("nodemailer");
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
dotenv.config();


//connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("connected to db"))

//middleware
app.use(express.json())

// import routes
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')


//routes middleware
app.use('/api/user', authRoute)
app.use('/api/user', postsRoute)


app.get("/mail", async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    // // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'genesisblock1033@gmail.com',
            pass: '7208393Nas@#'
        }
    })
    let info = await transporter.sendMail({
        from: 'genesisblock1033@gmail.com', // sender address
        to: "mdnuraminsifat380@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return res.json({ status: "Email Send...." })
})
app.get("/check",async (req, res) => {
    return res.send(req.cookies.generate_confirm_token)
})


app.listen(3000, () => console.log("Up and running and port is 3000"))