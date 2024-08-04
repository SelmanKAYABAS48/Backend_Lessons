"use strict"


const Token = require('../models/token.model')
module.exports = async(req,res,next)=>{

    // Get token from  Headers:
    const auth = req.headers?.authorization || null // burada headers'ta authorization gelmezse null kabul ediyoruz    //! Token ....tokenKey gelecek olan token 
    





}