let rateLimit = require('express-rate-limit')
let jwt = require('jsonwebtoken')
let {JWT_SECRET} = require('../config/env')

function authenticateToken(req,res,next){
    let authHeader = req.headers.authorization

    if(!authHeader) return res.status(401).json({message: "Token missing!"})

    let token = authHeader.split(" ")[1]

    try{
        let user = jwt.verify(token, JWT_SECRET)

            req.user = user

            next()
        }catch(err){
            res.status(401).json({message: "Invalid or expired token!"})
    }

    // Қысқа түрі төменде
    // let token = req.headers['authorization']?.split('')[1]

    // jwt.verify(token,JWT_SECRET , (err,user)=>{
    //     if(err){
    //         res.status(403).json({message: "token uaqyty bitti n/e token joq"})
    //     }else{
    //         req.user = user

    //         next()
    //     }
    // })
}

let loginLimited = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Тым көп әрекет. 1 минут күтіңіз',
    statusCode: 429,
});

module.exports = {
    authenticateToken,
    loginLimited
}