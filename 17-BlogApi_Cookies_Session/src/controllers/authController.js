"use strict";

//! burada userModel'e ihtiyacım var

const { User } = require("../models/userModel");
//! burada User Model'i kullandım.tek model üerine farklı controller yazılabilir

const passwordEncrypt = require("../helpers/passwordEncrypt");

// Auth Controller:

//* .auth ile obje olarak gönderdim
module.exports.auth = {
    login: async (req, res) => {
        // login'in mantığı ben giriş yaparken kullanıcı adı şifre gönderiyorum login gelen datayı veri taanından check edecek  eğer ok ise cookie'e böyle bir kullanıcı giriş yaptı cookie'de o veri saklanacak.logout olunca cookie o veriyi silecek

        const { email, password } = req.body; //! user'ın girdiği email ve password

        if (email && password) {
            // Email&Password Ok
            // console.log(email,password);

            //! burada hergelen email'i login oldu diye kabul edemem.Veri tabanında aramam lazım var mı yok mu diye.Veri tabanında kayıtlı olması lazım

            // const User = await User.findOne({email:email}) //! Key value ismi eşitse
            const user = await User.findOne({ email }); //MongoDB sorguları genellikle bir nesne (obje) şeklinde ifade edilir çünkü bu, birden fazla kriter belirtmeyi ve daha karmaşık sorgular oluşturmayı kolaylaştırır. //? Burada req ile gelen email'i findOne yapıp veri tabanında userModelinde arayacağm

            // *const User = await User.findOne({email}) ifadesinde arama yaparken veritabanında arama yapıyorsunuz, ancak User modelinin bir özelliğini kullanarak bunu gerçekleştiriyorsunuz.

            //! ÖNEMLİ user'da ayrıca şifre kontrolüde yapacağım ancak user'ın gönderdiği şifre ile bende gözüken aynı değil cryto'lanmış hali bunu.bende kullanıcının gnderdiği şifreyi şifreleyip bende gözükenle eşit mi diye sorgularım..Benim şifreleme fonksiyonuna ihtiyacaım var bu nedenle userModel'deki şifreleme fonksiyonunu helper adında klasöre aktaracağım dışarıdan çağıracağım

            if (user) {
                //* if (user) kısmı, MongoDB sorgusunun sonucunu kontrol eder. Eğer kullanıcı veritabanında bulunursa, user değişkeni bir kullanıcı nesnesi (obje) olacaktır. Eğer kullanıcı bulunmazsa, user null olacaktır. if (user) ifadesi, bu durumu kontrol etmek için kullanılır.

                //User ok

                // console.log(user); //! Burada login olmaya çalıştığımda user datası geliyor database'den password'ün şifrelenmiş halini gördüm

                if (user.password == passwordEncrypt(password)) {
                    // passwordEncrypt func.çalıştırdım parametre user'ın gönderdiği params
                    //? databaseden gelen şifre == eşit mi kullanıcının  req.body ile gönderdiği password'ün cryptolanmış haline eşit mi

                    // password OK
                    // res.send({
                    //     message:'Login is succesful'
                    // })

                    //! SESSION
                    // req.session = { //? Session datası tarayıcıya kaydediliyor ben silene kadar silinmiyor
                    //     data:'session-data' //! login url'sine gittiğimdme yani login olduğumda bu session kaydedilecek
                    // }// session datalarımıı saklayabildiğim değişken
                    // console.log(req.session);
                    // res.send('OK')

                    //! 1.kaydetme yöntemi
                    // req.session = {
                    //     email:user.email,
                    //     password:user.password
                    // }

                    //! 2.Kaydetme yöntemi
                    // req.session.email = user.email, //! burada Kullanıcının email ve pasword'ünü kaydettim

                    req.session._id = user._id; //! User'ın email'ini göstermek istemediğimiz için burada _id saklarız
                    req.session.password = user.password;

                    /*SESSION*/

                    //! Burada req.body tanımlı değilse bile hata vermez undefined döner                    
                    
                             /*COOKIE*/
                    if (req.body?.remindMe == true) {
                        req.session.remindMe = true,
                        //Set maxAge to 3 Days:
                        req.sessionOptions.maxAge = 1000*60*60*24*3

//!ÖNEMLİ: VERİLERİ SESSION'A KAYDETMEK YETMEZ.BUNLARI CHECK ETMEM LAZIM.BU ID VE PASSWORD DOĞRU MU--DOĞRUYSA DEVAM ET DEMEM LAZIM.CHECK EDERKEN KULLANICI DATASININ HEPSİNE ERİŞEBİLİRİM

          }

                    /*COOKIE*/

                    res.status(200).send({
                        error: false,
                        message: "Login:OK",
                        user, //! user datasını gösterecek
                    }); //? burada response alıyorum ve session'a kayıt yapacak

                    //!TEST'ini yaparken post /auth/login ve session'ı görmek için de anasayfaya get isteği atıyorum
                } else {
                    res.errorStatusCode = 401;
                    throw new Error("Login parameters are not true");
                }
            } else {
                res.errorStatusCode = 401;
                throw new Error("This User not Found"); //! user veri tabanında yoksa bu hatayı verecek
            }
        } else {
            res.errorStatusCode = 401;
            throw new Error("Email and password are required");
        }
    },

    logout: async (req, res) => {
        // Session/Cookie datasını silemk için null yeterli

        req.session = null;

        res.status(200).send({
            error: false,
            message: "Logout OK",
        });
    },
};

// Session'da data varsa

//! Session ve Cookie'ler çalınabilir. Bunlar frontEnd'te kullanılır.
//?Backend olarak cookie session kullanmayı tercih etmeyiz

//* Ancak güvenilirliğ noktasında sıkıntı olayacak dataları cookie'de saklayabiliriz

//! Mesela sayfalarda bazen 20 kayıt listelerken 50 kayıt saergilemek isteyince bunu cookie içerisnde saklayabiliriz kayıtı listeyebiliriz

//* Session'da email değil ID saklarız.Çünkü login olunca email gözükür.Email'in gözükmesini istemeyiz
