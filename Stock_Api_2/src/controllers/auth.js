"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const user = require('../models/user')
const token = require('../models/token')
const jwt = require('jsonwebtoken')
const passwordEncrypt = require('../helpers/passwordEncrypt')

module.exports = {

    login:async (req,res)=>{

            /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

            const { username,email,password} = req.body // req.body' gönderilen verileri alıyoruz

            if((username ||email) && password){ 
                // email ve password geldi ve bunu database'de sorgulayacağız
                
                const user = await User.findOne({$or:[{email},{username}]}) //* Öncelikle username or email ara yapacağımızdan $or yaptık sonra 2 arama olacağı için array açıp içnde objeleri açtım 1.sinde email'i email'e eşit olan username'i username'e eşit olan kaydı bul ve getir yaptık

                //eğer user null gelmediyse ve user.password 
                if(user && user.password == passwordEncrypt(password)){

                    if(user.isActive){
                        // User'a 2 çeşit giriş yöntemi hakkı tanımak istiyorum

                        //Simple Token:

                        // User'a benim user'ı tanıyabilmem için token oluşturmam lazım.Ancak eğer daha önce user login olduysa token oluşturulmuştur ve tekrar oluşturmak istemyorum..Eğer oluşturulduysa bunu Token modeline gidip oradan find yapacağım..userId'si giriş yapan user'ın _id'sine eşit olan bir token var mı yani önceden böyle bir token kayıtlı mı ona bakacağız
                        let tokenData = await Token.findOne({userId:user._id}) // eğer token varsa aşağıdaki create bölümü çalışmayacak eğer logout olduysa token yoksa çalışacak                        
                        // başında !olunca eğer kayıtlı değilse oluyor 
                        if(!tokenData){

                            tokenData = await Token.create({

                                userId:user._id,
                                token:passwordEncrypt(user._id + Date.now())// token'ın benzersiz olması için o anli zamanı alıyorum ancak aynı saniyede farklı kullanıcılar da giriş yaptıysa benzersiz olması için user'ın ıd'sini'de alıyorum
                                //* token'larım sabit olsun ve 64 karakter ve hexedecimal'den oluşan karakterlerden oluşsun istiyorum.64 karakter veri veren passwordEncrypt'tir..Burada password encrypt yapınca hem user'ıd ortaya çıkmasın yaptım token'ı user'a veriyoruz user'a frontEnd'ci yani token session cookie ya da local storage'e saklıyor userId ortaya çıkmasın hem de ortaya 64 karakterlik standart bir veri çıksın

                            })
                        }
                        



                        // JWT:

                        //! Jwt oluştururken sign ile yapıyoruz yani sign ile imzala yapıyoruz ve user datasını komple al yapıyorum burada ancak user datasını komple alırken obje ile ilgili problemler yaşıyoruz bunu da aşmak için toJSON yapıyoruz.Bu veriyi imzala yapıyoruz process.env'deki ACCESS_KEY ile imzala

                        const accessToken = jwt.sign(user.toJSON(),process.env.ACCESS_KEY,{expiresIn:'30m'}) // access özel bilgi içeren

                        const refreshToken = jwt.sign({_id:user._id,password:user.password},process.env.REFRESH_KEY,{expiresIn:'3d'}) // sign'da doğrulama yapacağım bilgiler lazım refresh daha genel bilgi içeren ve daha uzun ömürü olan-- yeni bir access token create etmek için kullanıyorum..


                        

                        // res.send
                        res.status(200).send({
                            error:false,
                            token:tokenData.token, // tokenData'nın içindeki token
                            bearer:{accessToken,refreshToken},// normal token'da token ancak JWT'de bearer kullanıyoruz
                            user
                        })

                    }
                    else{
                        res.errorStatusCode = 401
                        throw new Error('This account is not active')
                    }

                }
                else{
                    res.errorStatusCode = 401
                    throw new Error('Wrong username/email or password.')
                }


            }
            else{
                res.errorStatusCode = 401
                throw new Error('Please enter username/email and password.')
            }

    },

    refresh:async(req,res)=>{

         /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh access-token by refresh-token.'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '___refreshToken___'
                    }
                }
            }
        */

    },

    logout:async(req,res)=>{

             /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */


    }


}