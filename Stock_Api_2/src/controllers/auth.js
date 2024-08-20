"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const User = require('../models/user')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')
const jwt = require('jsonwebtoken')


module.exports = {

    login: async (req, res) => {

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

        const { username, email, password } = req.body // req.body' gönderilen verileri alıyoruz

        if ((username || email) && password) {
            // email ve password geldi ve bunu database'de sorgulayacağız

            const user = await User.findOne({ $or: [{ email }, { username }] }) //* Öncelikle username or email ara yapacağımızdan $or yaptık sonra 2 arama olacağı için array açıp içnde objeleri açtım 1.sinde email'i email'e eşit olan username'i username'e eşit olan kaydı bul ve getir yaptık

            //eğer user null gelmediyse ve user.password 
            if (user && user.password == passwordEncrypt(password)) {

                if (user.isActive) {
                    // User'a 2 çeşit giriş yöntemi hakkı tanımak istiyorum

                    //Simple Token:

                    // User'a benim user'ı tanıyabilmem için token oluşturmam lazım.Ancak eğer daha önce user login olduysa token oluşturulmuştur ve tekrar oluşturmak istemyorum..Eğer oluşturulduysa bunu Token modeline gidip oradan find yapacağım..userId'si giriş yapan user'ın _id'sine eşit olan bir token var mı yani önceden böyle bir token kayıtlı mı ona bakacağız
                    let tokenData = await Token.findOne({ userId: user._id }) // eğer token varsa aşağıdaki create bölümü çalışmayacak eğer logout olduysa token yoksa çalışacak                        
                    // başında !olunca eğer kayıtlı değilse oluyor 
                    if (!tokenData) {

                        tokenData = await Token.create({

                            userId: user._id,
                            token: passwordEncrypt(user._id + Date.now())// token'ın benzersiz olması için o anli zamanı alıyorum ancak aynı saniyede farklı kullanıcılar da giriş yaptıysa benzersiz olması için user'ın ıd'sini'de alıyorum
                            //* token'larım sabit olsun ve 64 karakter ve hexedecimal'den oluşan karakterlerden oluşsun istiyorum.64 karakter veri veren passwordEncrypt'tir..Burada password encrypt yapınca hem user'ıd ortaya çıkmasın yaptım token'ı user'a veriyoruz user'a frontEnd'ci yani token session cookie ya da local storage'e saklıyor userId ortaya çıkmasın hem de ortaya 64 karakterlik standart bir veri çıksın

                        })
                    }




                    // JWT: //* JWT'nin en büyük özelliği veri tabanına herhangi birşey yazmak zorunda değiliz.Ancak token'da veri tabanına yazmak zorundayız.findone yapıp create etmek

                    //! Jwt oluştururken sign ile yapıyoruz yani sign ile imzala yapıyoruz ve user datasını komple al yapıyorum burada ancak user datasını komple alırken obje ile ilgili problemler yaşıyoruz bunu da aşmak için toJSON yapıyoruz.Bu veriyi imzala yapıyoruz process.env'deki ACCESS_KEY ile imzala

                    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, { expiresIn: '30m' }) // access özel bilgi içeren

                    const refreshToken = jwt.sign({ _id: user._id, password: user.password }, process.env.REFRESH_KEY, { expiresIn: '3d' }) // sign'da doğrulama yapacağım bilgiler lazım refresh daha genel bilgi içeren ve daha uzun ömürü olan-- yeni bir access token create etmek için kullanıyorum..




                    // res.send
                    res.status(200).send({
                        error: false,
                        token: tokenData.token, // tokenData'nın içindeki token
                        bearer: { accessToken, refreshToken },// normal token'da token ancak JWT'de bearer kullanıyoruz
                        user
                    })

                }
                else {
                    res.errorStatusCode = 401
                    throw new Error('This account is not active')
                }

            }
            else {
                res.errorStatusCode = 401
                throw new Error('Wrong username/email or password.')
            }


        }
        else {
            res.errorStatusCode = 401
            throw new Error('Please enter username/email and password.')
        }

    },





    //! JWT kullandığım zaman access token'ın bir 30 dk bir ömrü var.30 dk bitmeden veya bittiğinde yeni access token istediğim zaman refresh token ile yeni bir access token isteyebiliyorum

    refresh: async (req, res) => {
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

        //* refresh token req.body'de bearer altında refreshToken adında gelecek

        const refreshToken = req.body?.bearer?.refreshToken

        //body'den refresh token'ı al ve refresh tokenı process.env.REFRESS_KEY ile çöz.daha doğrusu refresh token içindeki datayı doğrula.Eğer refresh key içindeki datanın süresi geçmemişse yani herşey yolundaysa callback fonksiyonunda 2 data var ilki err eğer hata varsa bu gelecek ikinci param ise hata yoksa gelecek olan datanın kendisi..özetle refresh token'ı verify ettiği zaman userData gelecek

        if (refreshToken) {

            jwt.verify(refreshToken, process.env.REFRESH_KEY, async function (err, userData) {

                if (err) {

                    res.errorStatusCode = 401
                    throw err
                } else {

                    const { _id, password } = userData

                    //* userdata'dan kullanıcının id'si ve password'ünü alıyoruz yani JWT refresh token'dan aldık

                    if (_id && password) { //* id ve password var mı ve aşağıda bu id'ye sahip kullanıcıyı bul dedik

                        const user = await User.findOne({ _id })

                        if (user && user.password == password) {

                            if (user.isActive) { //* Doğruladığım kullanıcı aktifse yeni bir access token oluşturuyoruz ve res.send ile gönderiyoruz

                                // JWT:
                                const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY, { expiresIn: '30m' })

                                res.send({
                                    error: false,
                                    bearer: { accessToken }
                                })

                            } else {

                                res.errorStatusCode = 401
                                throw new Error('This account is not active.')
                            }
                        } else {

                            res.errorStatusCode = 401
                            throw new Error('Wrong id or password.')
                        }
                    } else {

                        res.errorStatusCode = 401
                        throw new Error('Please enter id and password.')
                    }
                }
            })

        } else {
            res.errorStatusCode = 401
            throw new Error('Please enter token.refresh')
        }
    },




    //? Logout yaparken  header'da  authorization kısmında token ve token key ile bearer access gönderilir .sonra varsa auth split yapılır. bunu array formatına çeviriyor sonra 0.index Token ise klasik tokensa deleteOne yap.başlık Bearer ise else'e girer ver herhangi birşey yapmasına gerek yok


    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */

        const auth = req.headers?.authorization || null // Token ...tokenKey... // Bearer ...accessToken...
        const tokenKey = auth ? auth.split(' ') : null // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

        let message = null, result = {}

        if (tokenKey) {

            if (tokenKey[0] == 'Token') { // SimpleToken

                result = await Token.deleteOne({ token: tokenKey[1] })
                message = 'Token deleted. Logout was OK.'

            } else { // JWT  //! jwt ile logout işleminde herhangi birşeye gerek yok

                message = 'No need any process for logout. You must delete JWT tokens.'
            }
        }

        res.send({
            error: false,
            message,
            result
        })
    },

}


