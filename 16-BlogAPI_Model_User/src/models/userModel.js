"use strict";

// const {Schema,model} = require('mongoose') şeklinde de çağırabilirim
const mongoose = require("mongoose");
/*--------------------------------------*/
//! Password yazdığımda response'da şifreyi olduğu gibi görüyorum bu durum tehlikeli hacklendiğinde problem olur.Bu nedenle kriptılanmış şifreleme yöntemi kullanacağız

// Password Encrypt (PBKDF2 Method)

const crypto = require('node:crypto') // node:crypto built in (dahili) module'dir. npm install yapmama gerek yok

// Parameters:  crypto.pbkdf25Sync istiyor aşağıdaki parametreleri
const keyCode = 'process.env.SECRET_KEY' // Şİfreleme Anahtarı.Bunu .env'de yazdım
const loopCount = 10_000 // Döngü sayısı js _ number olarak algılıyor?
const charCount = 32 // write 32 get 64 karakter aldım  // kaç karater istiyorsak onun yarısı kadar yazıyoruz.Bunun nedeni buffer: verinin ram'deki hali 2'li olduğundan 32 yazıyoruz ancak aslında 64'tür
// Buffer 6b 30 4c e4 cc ae 54 93 c2 e5 7d 8f 6f b7 53 32 4b a1 2a e7 20 20 39 d8 d8 6b 3a f8 2c 21 30 f3
const encType = 'sha512' // Şifreleme algoritması


// parametre içinde şifre buraya normal geliyor return olurken crypted olarak çıkıyor
const passwordEncrypt = function(password) {

//? built-in olan crypto'yu alıyorum ve senkron olan metodu kullanıyorum

return crypto.pbkdf2Sync(password ,keyCode, loopCount, charCount, encType).toString('hex') //! buffer'ı string'e çavirdik ve k0L�̮T���}�o�S2K�*�  9��k:�,!0� böyle çıktı verdi ancak toString ('hex') yazarsam hexdecimal şeklinde çıktı verir

}
console.log(passwordEncrypt('123456')); //! şifre burada kaç karakter olursa olsun  charCount'tan dolayı 64 karakter gelecek tek karakter girsem bile 64 karakter return edecek





/*--------------------------------------*/

const UserSchema = new mongoose.Schema(
  {
    //! ilk parametre fields tanımlanıyor

    email: {
      type: String,
      trim: true,
      unique: true, //! aynı emaile sahip 2.kullanıcı olmamalı
      // required: true,
      required: [true,'Email is required'],
      // validate:(email)=>{ 
        // burada parametre datanın kendisi
        // Eğer return true ise kaydeder 
        // return true

        // if(email.includes('@') && email.includes('.'))
        // { return true}
        // else{ return false}
        // }

        // validate: (email)=> (email.includes('@') && email.includes('.')) //! burada && ile şart sağladık

        validate:[
          (email) => (email.includes('@') && email.includes('.')),
          'Email type is incorrect '
        ] // diğer yazım şekli hata mesajını yazdım

        // validate:(email)=>{

        //   if(email.includes('@') && email.includes('.'))
        //      { return true}
        //      else{ 
        //       throw new Error('Email type is incorrect' + email)
        //       } //! Burada email doğru ise true dönüyor. eğer yanlışsa  hata fırlatıp error handler'a gönderiyor
        // }

    },

    password: {
      type: String,
      trim: true,
      // required: true,
      required: [true,'Password is required'],
      // set: (password)=> passwordEncrypt(password) //* bir fonksiyonun parametresini başka bir fonksiyona yazıyorsak aşağıdaki gibi yazılabilir

      // set:passwordEncrypt, //! olarak da çağırılır
      // Yukarıda oluşturduğum fonksiyonu çağırdım
       // Veri kaydederken return edilen data kaydedilir
        
        // return 'selman' //! burada set metodunun return'ü ne ise respond'a password yerinde o yazacak yani password: selman

        //? .env'deki secret_key olmadan artık şifre döndürülmez hacker tarafından

     // set metodu validate metodundan önce çalışır.Böylece validate data herzaman aynı formattadır.Validate yapamayız..  request'te password'u boş göndersem bile respond'ta  64 karakterlik şifre oluşturuyor.  işin özü set validate'e bırakmıyor işi boş olsa bile şifreyi otomatik 64 karakter gönderiyor

     //! set metodu validate'ten önce çalışacağı için şöyle bir kurgu yapabiliriz set metodunu manipule ettik

    //  set:(password)=>{ // ilk önce set çalıştığı için validate'e giden password 8 ve üstüyse validate'e giden data doğru olur
    //   if (password.length >= 8){
    //     return passwordEncrypt(password)
    //   }
    //   else{ // eğer şifre'de sıkıntı varsa validate'e wrong gidiyor
    //     return 'wrong'
    //   }
    //  }
    
    //  validate:(password)=>{ // setten sonra eğer validate'e gelen string wrong ise validate'ten geçirme değilse geçir
    //   if(password == 'wrong'){
    //     return false
    //   } 
    //   else{
    //     return true
    //   }
    //  }

   set: (password) => (password.length >=8 ? passwordEncrypt(password): 'wrong'),

   validate:(password)=> (password != 'wrong' )
       
    }, //! güncelleme yaparken default olarak validate çalışmaz {runValidators:true} update yaparken validate'i aktif ederburası false olursa model'de kurduğum set yapsında 8 karakter yapısı tanmıyor yani 3 karakter yazsam bile kabul ediyor
//     Bu fonksiyon, password adında bir parametre alır ve şu mantığı içerir:

// password != 'wrong': Bu ifade, password değişkeninin 'wrong' değerine eşit olup olmadığını kontrol eder.
// Eğer password değişkeni 'wrong' değilse, bu ifade true döner.
// Eğer password değişkeni 'wrong' ise, bu ifade false döner.

    firstName: String,

    lastName: String,
  },
  {
    //! 2.parametre collection settings tanımlanıyor

    collection: "users",
    timestamps: true,
  }
);

// module.exports = mongoose.model('User',UserSchema) //! burada modele çevirip doğruce export yaptım Bu export direkt export

module.exports.User = mongoose.model('User',UserSchema) // Obje içinde gönderme

//! UserController yazacağım

// Koleksiyon Adı (collection name): MongoDB'de koleksiyon adları genellikle küçük harflerle ve çoğul olarak yazılır. Bu nedenle collection: "users" olarak belirtilmiştir.

// Model Adı (model name): Mongoose'da model adları genellikle büyük harfle başlar ve tekil formda yazılır. Bu, JavaScript'teki sınıf adlandırma konvansiyonuna uyar. Bu nedenle mongoose.model('User', UserSchema) şeklinde yazılır.

// Mongoose, model adını (User) alır ve MongoDB'deki koleksiyon adını (users) otomatik olarak küçük harfe ve çoğul hale dönüştürür. Bu, model adınızın User veya Person olması fark etmeksizin, koleksiyon adının users veya people olarak adlandırılacağı anlamına gelir.

// Özetle, User model adı kullanmak, kodunuzun okunabilirliği ve JavaScript konvansiyonlarına uyumu açısından daha iyi olur. Ancak MongoDB'de bu modelle ilgili belgeler users adlı koleksiyonda saklanır.