"use strict"
const { request } = require('express')
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

/* ------------------------------------------------------- *
{
    "username": "admin",
    "password": "aA?123456",
    "email": "admin@site.com",
    "firstName": "admin",
    "lastName": "admin",
    "isActive": true,
    "isStaff": true,
    "isAdmin": true
}
{
    "username": "staff",
    "password": "aA?123456",
    "email": "staff@site.com",
    "firstName": "staff",
    "lastName": "staff",
    "isActive": true,
    "isStaff": true,
    "isAdmin": false
}
{
    "username": "test",
    "password": "aA?123456",
    "email": "test@site.com",
    "firstName": "test",
    "lastName": "test",
    "isActive": true,
    "isStaff": false,
    "isAdmin": false
}
/* ------------------------------------------------------- */
// User Model:



const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        index:true //! index vermemin sebebi çok fazla sorgulama yapacağım için hızlı dönüş olması amacıyla index yapıyorum.Her field'a index verilmez verirsek alt yapı çok şişer,hiç index vermezsek bu sefer proje user sayısı arttıkça hantallaşır

    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        index:true
    },
    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isStaff:{
        type:Boolean,
        default:false

    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},
{
    collection:'users',
    timestamps:true
})

/*---------------------------------------------------------------*/
// https://mongoosejs.com/docs/middleware.html

const passwordEncrypt = require('../helpers/passwordEncrypt')

// save create aşaması ancak burada hem save hemde update yapmak istersem array içinde yazabilirim
UserSchema.pre(['save','updateOne'], function(next){

    // console.log('pre-save-çalıştı');

    // console.log(this);

    // const data = this //* this ile gelen veriyi dataya aktardım
    //* create yaparken kullandığım data this.ben burada aslında data'yı güncelledim  ancak benim güncelleme yapmam gereken yer this'dir 

    //? save'de datalar this içinde geldi _update'te ise datalar this._update içinde geldi

    //! Eğer güncelleme yapıyorsam this._update datasını kabul et.Güncellerken data = this._update içinde gelecek kaydederkense data = this içinde gelecek
    

    //*burada this._update geirse bunu kabul et gelmezse this'i kabul et yaptık ve veri tabanına yazılacak olan data'yı data isimli değişkene aktardık 
    const data = this?._update ?? this  //! normalde _ alt çizgi verinin değiştirilmemesi hatta çağırılmaması gerektiğini söylüyor bize içeriği nedeniyle önemli olması hasebiyle





    // Email Control:
    //! email gönderilemeyebilir.Mesala update yaparken.Bu nedenle email gönderilmişse onun validasyonunu yapsın

    //? Email'in meial formatında gönderilip gönderilmediğini modeldeki validate kullanılarak değil  pre save kullanrak yapıyoruz.

//! Burada email gönderilmişse aşağıdaki validasyondan geçip geçmediğini kontrol et.Eğer email datası gelmemişse direk true yap..true yap kısmı update'te email gelmeyebilir.bu nedenle doğruca true yaptık
const isEmailValidated = data.email ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) : true

    //*Eğer email validasyondan geçtiyse
    if(isEmailValidated){
        // console.log('Email is ok');
        //* Password validation:

        const isPasswordValidated = data.password ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(data.password) : true 

//* yukarıda this'i alıp dataya'assign ettim..sonra data içindeki email ve password'ü kontrol ettim.Eğer herşey yolundaysa data.password'ü şifrele ve data.password'ün şifrelenmiş halini this.password'e ata.Çünkü bana nihai olarak this'in içindeki password lazım




        if(isPasswordValidated){
            // console.log('Password is ok');

            // data.password = passwordEncrypt(data.password) 

            // this.password = passwordEncrypt(data.password) 

            if(this?._update){
// UPDATE'te ise //* this'in _update'ini güncelliyorum

this._update.password = passwordEncrypt(data.password)
            }
            else{

            // CREATE
            //* create'te this'in kendisini güncelliyorum
                this.password = passwordEncrypt(data.password) 
            }

            next()
            // burada data.password'ü şifreli halile değiştir yaptım
 // benim asıl şifrelemem gereken yer this'in içindeki password'ü şifrelemem gerek bu nedenle this.passwor yazıyorum

            //! this = data  // this parametresi direkt assign edilmez


        }

        else{
            console.log('Password is not validated');

            // throw new Error('Password is not validated')

            next (new Error('Password is not validated'))
        }




    }else{
//burada request error status'u gönderemem çünkü call back yaptığım yerde req.yok.ancak custom error yaparsam öyle gönderirim custom error,error olşturan bir classtır

        // throw new Error ('Email is not validated') //?error handler'a göndermemin bir yolu böyledir.

        next(new Error ('Email is not validated')) //! Error handler'a göndermenin 2.yolu


    }

    

    //! next çalışmayınca create işlemine geçemiyor

}) //save işlemini yapmadan önce. yani create işleminden önce.Kaydetmeden önce. burada next middleware olduğunu belirtiyor

/*---------------------------------------------------------------*/

module.exports = mongoose.model('User',UserSchema)

//! Pre middleware birşeyi yapmadan önce çalışacak olan middleware
//* Post middleware yapılmak istenen şey yapıldıktan sonra çalışcak olan middleware

           /*-----------------*

           next()'ten önce console'a this yazdım ve aşağıdaki data'yı aldım.bu database'e yazılacak olan data
{
    username: 'staff1',
    password: 'aA?123456',
    email: 'staff1@site.com',
    firstName: 'admin',
    lastName: 'admin',
    isActive: true,
    isStaff: true,
    isAdmin: true,

    aşağıdaki  data normalde this ile birlikte eklenen data
    _id: new ObjectId("66be240da03fc793fb0260fc"),
    createdAt: 2024-08-15T15:51:41.904Z,
    updatedAt: 2024-08-15T15:51:41.904Z
  }

           /*-----------------*/

           //! Bu data pre save ile tam kaydedilecekken next aktif olmadığı için işlem yapmadı



           //* controller'daki update bölümünde   
           // const data = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }) findById metodunu kullandığımız zaman pre save ve updateOne kısmında updateOne'ı yazmamıza gerek yok save onu da çalıştırır