const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
    const token = req.header('auth-token')
    console.log(token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA3OTIxNWFkYWRjNzEyNjliMTg1MGYiLCJpYXQiOjE2Mjc4ODg4MjB9.d6lH-3cG594nQn3ISMgQ25XOmXvqZazDl69mm4sCQd8')
    if(!token) return res.status(401).send("Access Denied...")
    try{

        const verified = jwt.verify(token,process.env.TOKEN_SECRET)
        console.log("varified",verified)
        req.user = verified;
        next();
    }catch(err){
        return res.status(401).send("Invalid token...")
    }
}