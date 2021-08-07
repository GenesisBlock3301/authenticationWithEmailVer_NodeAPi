const router = require('express').Router();
const verify = require("./verifyToken")
const User = require("../models/User")

router.get('/posts',verify,(req,res)=>{
    return res.send(req.user._id)
})

module.exports = router;