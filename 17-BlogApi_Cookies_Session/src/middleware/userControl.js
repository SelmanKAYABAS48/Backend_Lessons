"use strict"

const { User }= require('../models/userModel')



//Authentication Middleware

//Session içindeki user id ve passwordü kontol eden middleware

module.exports= async(req,res,next)=>{

//! Bu middleware genel middleware bu nedenle index'te tepelerde yer almalı..İndex'te router'lar başlamadan önce yer almalı.session ile router arasında...


req.user = null  // property oluşturdum


// console.log(req.session);

// console.log(req.user);

// req.user'ı null olarak ayarlamak, varsayılan olarak kullanıcının kimlik doğrulamasının yapılmadığını veya kullanıcı bilgisinin mevcut olmadığını belirtmek için kullanılır. Bu genellikle kullanıcı oturumunun olup olmadığını kontrol eden middleware'lerde yaygın bir uygulamadır


//? Aşağıda  if içinde session var mı sonra find kısmında sessiondaki  id sessiondaki  password  eşleşiyor mu..eşleşiyorsa ok req.user'ı user datası ile donatıyoruz

if(req?.session?._id){ 

    // const  user = await User.findOne({_id:req.session._id,password:req.session.password}) //! Burada password'ün olması hatalı
     const  user = await User.findOne({_id:req.session._id})
    // id session id'ye eşit password session password'e eşit olsun //! Session'daki id'ye ait kullanıcıyı bul yani hem sessiondaki id ve password'ü eşit olan kullanıcıyı bul

//*MIDDELEWARE ID VE PASSWORD'Ü KONTROL EDİYOR EĞER ID VE PASSWORD DOĞRUYSA USER DOLU GELİR

    //? 

    if(user&& user.password == req.session.password){ // yukarıda kullanıcı datalarını tutmak için  req objesinin içine user property'si oluşturdum 

       
        req.user = user
        // Kullanıcı Bilgisini req.user'a Atama:
        // if (user) ifadesi, bir kullanıcı belgesi bulunup bulunmadığını kontrol eder.
        // Eğer kullanıcı belgesi bulunursa (user değişkeni null değilse veya undefined değilse), req.user = user ifadesi, kullanıcı belgesini req.user özelliğine atar.
        // Bu atama işlemi, kullanıcı bilgilerini sonraki middleware veya route handler'larda kullanılabilir hale getirir. Bu sayede, uygulamanızın diğer kısımlarında req.user üzerinden kullanıcı bilgilerine erişebilirsiniz.


      
    }else{

        //! burada silme işlemi yaptık
        req.session = null //* session'daki data yanlışsa session'ı boşalt daha fazsla böyle devam etmesine izin verme demek

    }

} //!? burada req.session var mı onun da içinde _id var mı

next()

}


//? response 
// Session {
//     id: '669e3c6557c6794fba37f5bf',
//     password: '5e9ba1ac7575a4644c9edaaac1becb5e31e9591ed363b544c6a4036d97fd8611',
//     remindMe: true
//   }

//! IMPORTANT...

//! const  user = await User.findOne({_id:req.session._id,password:req.session.password}) 

//* burada kurduğum yapıdaki password şifreleme işlemini de kapsıyor ve bu şifreleme durumu userModel'deki set kısmındadır asıl ancak but setter'ı findOne'da çalıştırıyor..normalde findOne'da çalışmaması lazım.set aslında kaydetmek demek..

//? Yukarıda sesssion'daki password'ü'de şifreliyor.yani model'de çalışması gerekirken burada da çalışıyor.olmaması gereken bir durum.bunu kod değişikliği yaparak çözebiliriz


//!Session'daki datalar benim işimi görmez user'daki dataları tümden görmem lazım .Session datası tarayıcıya kaydedilir.Session'a user'ın datalarının kaydedilmesini istemeyiz.çünkü kritik bilgiler olabilir.Backend yazılımında id ve password benim işimi görmeyebilir.komple user datasına ihtiyacım olabilir..Kullanıcının id'si değişmiş olabilir pasif olabilir silinmiş olablilr password değişmiş olabilir..session'daki datalar cookiedeki tarayıcıdaki  datalar---user datası ile veri tabanındaki datalar..cookiedeki datayı sorgulama ihtiyacı hissediyorum...

//*Cookie kaydettiğim id ve password hala geçerli mi eğer geçerli ise bana user datasını ver diyorum..bunu da req.user datasına atıyorum


//? const  user = await User.findOne({_id:req.session._id}) --> buradaki user User.findOne'dan gelen dataı alacak ve user'a assign edecek ve aşağıdaki if'e gidip eğer user ok ise req.user'a user datalarını assign et

//? if(user&& user.password == req.session.password) * buradaki user yukarıdaki user

// req.user= user

//! eğer user ok değilse req.session = null session'ı sil yanlış bir bilgi içerdiği için komple sil iptal ethemde yukarıda req.user = null kalsın bu aşamada req.user henüz onaylanmadı 

//  aşağı inde session'da id var mı  if(req?.session?._id)
//*bu id'nin veri tabanında karşılığı var mı User.find({_id:req.session....})
//? veri tabanında karşılığı olan user'ın password'ü doğru mu if(user&& user.password==req.session.password)
// ozaman bu user onaylandı req.user = user
// yanlış ise req.session = null yani iptal et yani burada yanlışlık varsa session'daki data'da yanlıştır


/*---------------------------------*/

//!summary

//authController'dayım:
//? Kulanıcı modelimiz bizim için özel bir modeldir ve içindeki email ve password'de biz kullanıcı girişi yapıyoruz.Email ve password doğruysa kulanıcı giriş yapabilmeli.yanlışsa yapamamalı..kullanıcının giriş yapabilmesi için login çıkış yapabilmesi için logout controllers yazdık.router vs bağladı

//!Kullanıcı login'e geldiğinde email ve password'u kulanıcadan aldık const { email,password} = req.body

//* email ve password doğru geldiyse if(email&&password) bu email'İ veri tabanında sorgulamak isterim. const user = await User.find({email}) ile sorguladım yani böyle bir email'e sahip kullanıcı var mı yok mu

// eğer varsa if (user)
// if(user.password == passwordEncrypt(pasword){}) kullanıcının yalın password'ünü şifreleyip veri tabanındaki haliye eşitmi diye check ettim

//! eğer ok'ise kullanıcının datasını kendim sistem olarak hatırlmama için onu bir session'a veya cookie'ye kaydetmem lazım..

//* öncelikle bu session'a user'ın id ve password'ünü kaydettim req.session._id = user.id,req.session.password

//? sonra kullanıcı beniHatırla'ya işaretlemişmi yani onun datasını 3 gün kaydetmemi istiyor mu

// if (req.body?.remindMe == true) {
//     req.session.remindMe = true,
//     //Set maxAge to 3 Days:
//     req.sessionOptions.maxAge = 1000*60*60*24*3 true ise 3 gün sakla yapıyoruz eğer istiyorsa zaten buraya girmeyecek session olarak kalacak

// res.status(200).send({
//     error: false,
//     message: "Login:OK",
//     user, //! user datasını gösterecek  Buradaki user FindOne'daki User
// })

//* logout olmak istersem req.session = null yapıyorum

//! bu kayıtları session'a kaydetmek yeterli mi değil.session'daki data geçerliliğini kaybetmiş olabilir yani parola id değişmiş olabilir..ve asynı zamanda user'ın email adı soyadı gibi detaylarada ihtiyacım olabilir..sessionDAki datayı check etmem lazım ve bunu middleware'e atadım

//? index'te middleware'ları route'ların üstünde tanımladım..Buradaki amacım route'lara gitmeden herbir url ziyaretimde middleware'e gidecek ve session'daki datalar kontrol edilecek mesela user pasword'ü değştirdiyse sessiondaki datanı kıymeti kalmayacak çıkış yapacak bu nedenle userControl yapan middle ware yazdık

//* blogModel'e gittik ve userId ekledik

// userControl'de session id'ler varsa user datasını req.user'a assing et...

//* eğer bir datayı req ya da res'e iliştiriyorsak yani req ya da res objesini field olarak ekliyorsak.oan heryerden erişebiliyorum demektir..

//tıpkı index'ten erişebildiğim gibi indexte de sesion ve user'a erişebiliyorum

// app.all('/', (req, res) => {
//     res.send({
//         message: 'WELCOME TO BLOG API',
//         session: req.session,
//         user: req.user,
//         isLogin: (req.user ? true : false)
//     })
// })


//! buradan blogController'a gittim ve blogPost'a geçtim oradan da create bölümğne geçtim

//! blogPost'a data göndermeye çalıyorum benden userId istiyor.ancak ben login oldum zaten..benim userId'mi otomatik yakala

//* create bölümünde  req.body.userId = req.session?._id yaptım yani blogPost'ta post işşemi yaptığımda id'yi middle ware'den alıyorum




