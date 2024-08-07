"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
/*
    $ npm i express dotenv mongoose@latest express-async-errors
    $ npm i cookie-session
    $ npm i jsonwebtoken
*/

const express = require("express");
const { dbConnection, mongoose } = require("./src/configs/dbConnection");
const app = express();

/* ------------------------------------------------------- */

// continue from here...
// envVariables to process.env:
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------------- */
//db connection
dbConnection();

//body parser
app.use(express.json());

//httpOnly:true XSS Cross Site Scripting
app.use(
  require("cookie-session")({
    secret: process.env.SECRET_KEY,
    // cookie: {
    //     secure: !(process.env.NODE_ENV=="development"),
    //     httpOnly: false,
    //     maxAge: 24 * 60 * 60 * 1000,
    //   }
  }),
);

/*-------------------------------------------*
//Logger

const morgan = require('morgan')

// app.use(morgan('tiny'))
// app.use(morgan('short'))
// app.use(morgan('dev'))
//  app.use(morgan('common'))
//  app.use(morgan('combined'))
 //Custom Log:
//  app.use(morgan('TIME=":date[iso]" - URL=":url" - Method=":method" - IP=":remote-addr" - Ref=":referrer" - Status=":status" - Sign=":user-agent" (:response-time[digits] ms)'))

 //Write to File:

 const fs = require('node:fs') //! fs module'ü nodeJS'de dosya işlemlerini tuttuğum module.dosya sile ekle taşı işlemleri file system dahili sistem olduğu için npm install yapmama gerek yok

//  app.use(morgan('combined',{ 
      // stream= akış demek cWStream ise akış olduğunda yaz demek
// stream: fs.createWriteStream('./access.log',{ flags:'a+'})  //? her dosya işlemlerinde (bütün dillerde dosya açma kapama işlemi yapacağım zaman) ona bir flag ataması yapmam gerekiyor.flag dosyaya nasıl davranacağım onu gösteren bi özellik a+ dosyayı okumak için aç ve ekleme yap yoksa oluştur  --burada access.log dosyasına eriş ve flag'e göre işlem yap //! nodejs file-system-flags'ten araştır

//  })) //* 1.log kaydı tutma şekli,2.dosyalama ayarları yani options  yukarıdaki gibi log kaydı tutunca her bir client girdiğinde tutulan logs  dosyada çok fazla yer kaplar


// write to File day by day:

const now = new Date()
console.log(now, typeof now); // burada saati saniyesi ile veriyor.tipi object 
const today = now.toISOString().split('T')[0] // burada objeden string'e çevirmemin sebebi split yapacağım için 2024-08-06T18:05:01.789Z //! aradaki T'ye göre split yaptı  yani t'nin sol tarafına index 0'ı sağ tarafına index 1'i attı   ve [0] index 0'ı istedim !!! bu logları dosyaların orada ana dizinde değil de bir kalsörün içinde tutatcağım
console.log(today,typeof today);
 app.use(morgan('combined',{ 

  // stream: fs.createWriteStream('./access.log',{ flags:'a+'})  })) /access.log dosyanın adı
  stream: fs.createWriteStream(`./logs/${today}`,{ flags:'a+'})  })) // loglarımılogs klasörü içinde today formatında yani günün tarihi formatında saklıyorum..burada backtick kullanmamın nedeni günlük olarak yani dinamik olarak tuttuğum için 



/*-------------------------------------------*/
//DOCUMENTATION:
// npm i swagger-autogen //! bana json dosyası oluuşturacak 1 Kez çalışacak
// npm i swagger-ui-express //* json dosyasını swagger'da görüntüleyecek
// npm i redoc-express //? json dosyasını redoc'ta çalıştıracak



/*-------------------------------------------*/

// Morgan Logger:
app.use(require('./src/middlewares/logger'))

// Authentication Middleware:
app.use(require('./src/middlewares/authentication'))

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to PERSONNEL API",
    // session: req.session,
    // isLogin: req.isLogin,
    user: req.user
  });
});

// /auth
app.use('/auth', require('./src/routes/auth.router'))

// /tokens
app.use("/tokens", require("./src/routes/token.router"));

// /departments
app.use("/departments", require("./src/routes/department.router"));

// /personnels
app.use("/personnels", require("./src/routes/personnel.router"));

//not found routes
app.all("*", async (req, res) => {
  res.status(404).send({
    error: true,
    message: "Route not available",
  });
});

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')()

// if (process.env.NODE_ENV == "development") {
//   return;
//   require("./src/helpers/dataCreate")()
//     .then((res) => console.log("Data synched"))
//     .catch((err) => console.error("Data could not synched"));
// }

