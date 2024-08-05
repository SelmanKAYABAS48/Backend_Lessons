"use strict"


const Token = require('../models/token.model')
module.exports = async(req,res,next)=>{

    req.user = null

    // Get token from  Headers:
    const auth = req.headers?.authorization || null // burada headers'ta authorization gelmezse null kabul ediyoruz    //! Token ....tokenKey gelecek olan token 

    const tokenKey = auth ? auth.split(' '):null // auth varsa auth'u split yap auth yok null yap bana dönüşü  ['Token','..tokenKey'] 0.index'i Token 1.index'i token'ın kendisi 

    // 0.index Value'da yazan Token'a eşit mi
    if(tokenKey && tokenKey[0] == 'Token') {

        const tokenData = await Token.findOne({ token: tokenKey[1]}) .populate('userId')// token field'ı

        console.log(tokenData);

        if(tokenData) req.user = tokenData.userId
    }
   next()   // index'te require etmeyi unutma router'ların üstünde olsun
}