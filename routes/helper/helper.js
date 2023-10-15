const router = require('express').Router();
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const cookieParser = require('cookie-parser');
router.use(cookieParser());


const confirm_token = (req, res, paraToken) => {
    const token = req.cookies.generate_confirm_token
    console.log("Confirm Token", token)
    if (token !== paraToken) {
        return res.status(401).json({ token1: token, token2: paraToken })
    }
    const verified = jwt.verify(token, process.env.EMAIL_VER_SECRET_KEY)
    console.log("Verified", verified)
    return verified
}


const generate_confirmation_token = (email) => {
    const token = jwt.sign({ email: email }, process.env.EMAIL_VER_SECRET_KEY, {
        expiresIn: "3600s",
        // it will be expired after 10 hours
        //expiresIn: "20d" // it will be expired after 20 days
        //expiresIn: 120 // it will be expired after 120ms
        //expiresIn: "120s" // it will be expired after 120s
    })
    return token
}

const send_mail = async (email, token) => {
    console.log("Send mail token", token)
    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'genesisblock1033@gmail.com',
            pass: '<pass>'
        }
    })
    return await transporter.sendMail({
        from: 'genesisblock1033@gmail.com', // sender address
        to: "mdnuraminsifat380@gmail.com", // list of receivers
        subject: "Hello ", // Subject line
        text: `
        Hello thanks for registering on our site. Please copy and paste bellow address to verify your
        account: 
        http://localhost:3000/api/user/confirm/${token}
        `, // plain text body
        html: `
        <h1>Hello,</h1>
        <p>Thanks registering on our site </p>
        <p>Please click the below link to verify your account...</p>
        <a href="http://localhost:3000/api/user/confirm/${token}">Verify your account --> http://localhost:3000/api/user/confirm/${token}</a>
        ` // html body
    });

}


module.exports.generate_confirmation_token = generate_confirmation_token;
module.exports.confirm_token = confirm_token;
module.exports.send_mail = send_mail;
