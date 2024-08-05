/*-------------*
"use strict"


const Token = require('../models/token.model')
module.exports = async(req,res,next)=>{

    req.user = null // öncelikle req.user'ı null yapıyor

    // Get token from  Headers:
    const auth = req.headers?.authorization || null // burada headers'ta authorization gelmezse null kabul ediyoruz    //! Token ....tokenKey gelecek olan token 

    const tokenKey = auth ? auth.split(' '):null // auth varsa auth'u split yap auth yok null yap bana dönüşü  ['Token','..tokenKey'] 0.index'i Token 1.index'i token'ın kendisi 

    // 0.index Value'da yazan Token'a eşit mi
    if(tokenKey && tokenKey[0] == 'Token') {

        const tokenData = await Token.findOne({ token: tokenKey[1]}) .populate('userId')
        // populate, MongoDB'deki referans edilen belgeleri çekmek ve belgelerin içeriğini zenginleştirmek için kullanılır. Bu sayede ilişkili veriler daha okunabilir ve kullanışlı hale gelir.

        console.log(tokenData);

        if(tokenData) req.user = tokenData.userId //! tokenData'dan gelen userID req.user'a atandı
    }
   next()   // index'te require etmeyi unutma router'ların üstünde olsun
}
// session'daki user'ın parolası ve id'si benim için yeterli değil kullanıcının daha fazla bilgisine ihtiyaç duyabilirim parola da değimiş olabilir.bunun için user control adında middleware yapmıştık..

/*-----------------*/

"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
// Authentication Control Middleware:

const Token = require('../models/token.model')

module.exports = async (req, res, next) => {

    req.user = null;

    // Authorization: Token ...tokenKey...
    // Authorization: ApiKey ...tokenKey...
    // Authorization: Bearer ...tokenKey...
    // Authorization: Auth ...tokenKey...
    // Authorization: X-API-KEY ...tokenKey...
    // Authorization: x-auth-token ...tokenKey...

    // Get Token from Headers:
    const auth = req.headers?.authorization || null // Token ...tokenKey...
    const tokenKey = auth ? auth.split(' ') : null // ['Token', '...tokenKey...']

    if (tokenKey && tokenKey[0] == 'Token') {

        const tokenData = await Token.findOne({ token: tokenKey[1] }).populate('userId')
        // console.log(tokenData)
        if (tokenData) req.user = tokenData.userId

    }
    // console.log(req.user)

    next()
}


/* ------------------------------------------------------- */