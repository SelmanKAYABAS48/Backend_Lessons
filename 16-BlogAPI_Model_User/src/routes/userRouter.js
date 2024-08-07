"use strict"

//!ÖNEMLİ PASCAL CASE İLE AŞLIYORSA MODEL      User
//?CAMEL CASE İLE BAŞLIYORSA CONTROLLER'DIR    userController


const router = require('express').Router()

//*Call Contreller
const {user} = require('../controllers/userController') //burada controller olduğu için camelCase yazdık

/*----------------*/

// URL: /user->      //? /user'ı index'te belirledim ve buraya /user'dan sonra gelecek path'i belirliyorum burada('/')  anasayfa yaptım
//! index'te app.use içinde router'ı require ediyorum ve orada ilk route'u belirliyorum
router.route ('/')
.get(user.list) //! /user'dan sonra / anasayfada get isteği yapmak istiyorsam 
.post(user.create )

router.route('/:userId') //! controller'da userId olarak yazdım burada çağırırken dikkat et
       .get(user.read)
       .put(user.update)
       .patch(user.update)
       .delete(user.delete)
       

/*----------------*/

module.exports =router