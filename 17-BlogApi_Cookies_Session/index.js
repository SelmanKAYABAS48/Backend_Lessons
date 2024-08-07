// "use strict";
// /* -------------------------------------------------------
//     EXPRESSJS - BLOG Project with Mongoose
// ------------------------------------------------------- */

// const express = require("express");
// const app = express();

// require("dotenv").config();
// const PORT = process.env.PORT || 8000;

// /* ------------------------------------------------------- */
// // Accept JSON:
// app.use(express.json())

// // DB CONNECTION:
// // const dbConnection = require('./src/dbConnection')
// // dbConnection()
// require('./src/dbConnection')()

// // Catch error from async:
// require('express-async-errors')

// /* ------------------------------------------------------- */
// // npm i cookie-session

// const session = require('cookie-session') // session middleware..
// // session'ı require edip module'ü çağırdım bu bir middleware'dır.bu nedenle app.use içine bun kullandım

// app.use(session({// Genel ayarlar //!Burada middleware olarak çağırdım
//     secret: process.env.SECRET_KEY, // cookie datası şifrelenerek saklanır burası şifreleme anahtarı..env'den aldım
//     // maxAge:1000*60*60*24*3// miliSeconds cinsinden ve 1000 1saniyedir //! Ömrü bukadar 3 gün sonra silinecek  
//     //? mantık yürüteceğim için 
//     // *60 = 1dk *60 = 1saat*24=1gün *3=3gün  ÖMÜR VERİLİNCE COOKIE TARAYICI KAPANINCA SESSION
// }))
// /* ------------------------------------------------------- */

// app.all('/', (req, res) => {

//     res.send({
//         session:req.session, //! req.session session module'den aldım burası session datanın saklandığı yer SESSION ile ilgilil data işlemlerimi req.session ile yapacağım.req.session parametresi nini kullanarak data ekleme silme işlemi yapacağım

//         //*App.use'da kullandığım session'ı yoruma alırsam istek kısmında sadece aşağıdaki message görünüyo.Normal çalıştırınca session boş halde geldi data olmadığı için
//         message:'WELCOME TO BLOG API'})
// })

// /* ------------------------------------------------------- */
// // Routes:

// app.use('/auth', require('./src/routes/authRouter')) // User Model -login logot herhangi bir model tanımlamadım mevcut user model'ini kullanacağım
// app.use('/user', require('./src/routes/userRouter')) // User Model
// app.use('/blog', require('./src/routes/blogRouter')) // BlogCategory & BlogPost

// /* ------------------------------------------------------- */
// // Catch Errors:
// app.use(require('./src/middleware/errorHandler'))

// /* ------------------------------------------------------- */

// app.listen(PORT, () => console.log('Running: http://127.0.0.1:' + PORT))

/*-----*/

"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8000;

/* ------------------------------------------------------- */
// Accept JSON:
app.use(express.json())

// DB CONNECTION:
// const dbConnection = require('./src/dbConnection')
// dbConnection()
require('./src/dbConnection')()

// Catch error from async:
require('express-async-errors')

/* ------------------------------------------------------- */
// SessionCookies:
// http://expressjs.com/en/resources/middleware/cookie-session.html
// https://www.npmjs.com/package/cookie-session
//* $ npm i cookie-session

const session = require('cookie-session') // Session Middleware

app.use(session({ // General Settings.
    secret: process.env.SECRET_KEY, // Cookie datası şifreleme anahtarı
    // maxAge: 1000 * 60 * 60 * 24 * 3 // miliSeconds // 3 Days
}))

/* ------------------------------------------------------- */
// Middleware for check user data from session:

app.use(require('./src/middleware/userControl'))

/* ------------------------------------------------------- */

app.all('/', (req, res) => {
    res.send({
        message: 'WELCOME TO BLOG API',
        session: req.session,
        user: req.user,
        isLogin: (req.user ? true : false)
    })
})

/* ------------------------------------------------------- */
// Routes:

app.use('/auth', require('./src/routes/authRouter')) // User Model - Login/Logout
app.use('/user', require('./src/routes/userRouter')) // User Model
app.use('/blog', require('./src/routes/blogRouter')) // BlogCategory & BlogPost

/* ------------------------------------------------------- */
// Catch Errors:
app.use(require('./src/middleware/errorHandler'))

/* ------------------------------------------------------- */

app.listen(PORT, () => console.log('Running: http://127.0.0.1:' + PORT))