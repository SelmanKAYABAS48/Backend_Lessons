"use strict"

const Personnel = require('../models/personnel.model')
const Token = require('../models/token.model') //! burada personel modeli ile token modeline ihtiyacım olacak.Login işlemi başarılı olduğunda   Token oluşturup front end'e göndereceğim..Artık login olup olmadığımı bana bu login ile ispatla diyorum

const passwordEncrypt = require("../helpers/passwordEncrypt")


module.exports = {

    login: async (req,res)=> {

        const { username , password } = req.body // req.body içindeki username ve password'ü destructing yaptık

        if ( username && password) {

            // const user = personnelModel.findOne({ username:username})
            const user = await Personnel.findOne({ username}) //fbu username'e ait personel metodu'nu user'a atıyoruz

            // Mongoose'un findOne metodu, verilen kriterlere (koşullara) uyan ilk belgeyi bulur ve döndürür. Kriter bir JavaScript nesnesi olarak belirtilir ve hangi alanlarda arama yapılacağını gösterir.
            // Kriter Nesnesi ({ username }):
            
            // Kriter nesnesi, { username } şeklindedir. Bu, username değişkeninin değerini içeren bir nesne oluşturur.

            if(user && user.password == passwordEncrypt(password)) {

                if (user.isActive){
                 //! user çok defa post isteği gönderebilir herseferinde token oluşturur bu da sıkıntılı durumdur..eğer user'a token oluşturduysam sistemde gözükecek ve bir daha oluşturmayacak.yani her login2e basınca token oluşacağı için token tablo collection'u çok şişmemeli

                 //* Token var mı?
                 let tokenData = await Token.findOne({ userId:user._id}) //? Token. ile token modeline git.findOne yap ve userId: user._id   kullanıcı giriş yapınca 18.satırdaki user ile userId gelecek...yani Token'da userId:user._id bu kullanıcıya ait token var mı kontrol et yapıyorum yani oluşturmuşmuyum eşleştirme yapıyorum

                 //! Kullanıcıya token'ı verdik ve frontEnd bunu local storage'e saklıyor..Kulanıcı sonra başka URL'ye gidiyor...frontend bana bu token'ı Header'da gönderecek..Header'da authorization başlığı altında value'sına Token boşluk benim user'a verdiğim token yazılacak.bunu front end gönderecek header altında....kendi kullanıcılığını tanıtmak adına...token backend'te kimlik no gibi düşün....backend olarak kullanıcıyı verilen tokendan tanıyacağım..token yanlış gelirse silinmişse böyle bir kullanıcı yok diye dönüş olacak.token doğruysa şu kullanıcı giriş yaptı diye söylüyor***user login oldu frontEnd kendi varlığını ispatlamak adına--session cookie varken forntEnd'in yapması gereken bişey yoktu zaten session ve cookie user blgilerini saklıyordu. backend api servisi olarak session cookie'yi tercih etmiyoruz----header başlığı altında token'ı Backend'e gönderiyor...header'da gönderilen token'ı kabul etmemiz lazım..bu neden le authentication middleware'da ayarlamaları yapacağız
                 

                 //* Token yoksa oluştur

                 if(!tokenData){
                    tokenData = await Token.create({
                        userId:user._id,// create aşamasında userId'yi user._id den doldurduk
                        token:passwordEncrypt(user._id+Date.now())//user._id'yi al yanına o an ki saniyeyi yaz ve bunları passwordEncrypt yap

                    })
                 }

                 res.status(200).send({
                    error: false,
                    token:tokenData.token,
                    user
                 })


                }
                // admin olarak banlayabilirim yani falsa yapabilirim.hangi kullanıcıyı false yaparsam artık giriş yapamaz
                else{
                    res.errorStatusCode = 401 
            throw new Error ('This user is not active')
                }

            }// user var mı ve pasrolası encrypt edilmiş password'e eşit mi kontrolü
            else{
                res.errorStatusCode = 401 
            throw new Error ('Wrong username or password') // şifre yada username yanlış ya da 2si yanlış
            }

        }
        else{
            res.errorStatusCode = 401 
            throw new Error ('Please enter username and password')
        }

    },

    logout:async(req,res)=>{

        
    }
}