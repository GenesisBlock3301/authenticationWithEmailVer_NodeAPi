const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require("bcryptjs")
const {registerValidation, loginValidation} = require('../validation')
const jwt = require("jsonwebtoken")


router.post("/register", async (req, res) => {

    //lets validate the data before create user.
    const {error} = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // checking if the user already exist in database
    const emailExist = await User.findOne({email:req.body.email})
    if(emailExist) return res.status(400).send("Email already exists....")


    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt)

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const savedUser = await user.save()
        return res.send(savedUser)
        
    } catch (e) {
        res.status(400).send(e)
    }
})

// login method
router.post('/login',async (req,res)=>{

    //lets validate the data before login
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    // checking if the user already exist in database
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("Email or password is wrong")


    // password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password)
    if(!validPass) return res.status(400).send("Invalid Password")


    // CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token)
})

// router.post('/login')
module.exports = router;