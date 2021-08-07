const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require("bcryptjs")
const { registerValidation, loginValidation } = require('../validation')
const jwt = require("jsonwebtoken")
const { generate_confirmation_token, confirm_token, send_mail } = require('./helper/helper')
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.post("/register", async (req, res) => {

    //lets validate the data before create user.
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    // checking if the user already exist in database
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send("Email already exists....")


    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const savedUser = await user.save()
        const token = generate_confirmation_token(user.email)
        console.log("Regi token",token)
        res.cookie('generate_confirm_token', token, {
            maxAge: 3600_000,
            httpOnly: true,
        })
        send_mail(savedUser.email, token)
        res.json({ status:savedUser})

    } catch (e) {

        res.status(400).json({ error: e })
    }
})

// login method
router.post('/login', async (req, res) => {

    //lets validate the data before login
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    // checking if the user already exist in database
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email or password is wrong")


    // password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send("Invalid Password")


    // CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "10h",
        // it will be expired after 10 hours
        //expiresIn: "20d" // it will be expired after 20 days
        //expiresIn: 120 // it will be expired after 120ms
        //expiresIn: "120s" // it will be expired after 120s
    })
    res.header('auth-token', token).json({ token: token })
})


router.get('/confirm/:token', async (req, res) => {
    try {
        const token = req.params.token;
        console.log("confirm token--",token)
        const conf_email = await confirm_token(req, res, token);
        const user = await User.findOne({ email: conf_email.email })
        if (user.active) {
            res.status(401).json({ status: 'Your account is already logged IN.' })
        }
        else {
            user.active = true
            await user.save()
            res.send({ data: user })
        }
    } catch (err) {
        res.status(401).json({ status: 'The confirmation link is invalid or has expired.' })
    }

})

// router.post('/login')
module.exports = router;