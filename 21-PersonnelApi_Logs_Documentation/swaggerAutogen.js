"use strict"

require('dotenv').config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

/*----------------------------------------------------------- *

const options = {
    openapi:          <string>,     // Enable/Disable OpenAPI.                        By default is null
    language:         <string>,     // Change response language.                      By default is 'en-US'
    disableLogs:      <boolean>,    // Enable/Disable logs.                           By default is false
    autoHeaders:      <boolean>,    // Enable/Disable automatic headers recognition.  By default is true
    autoQuery:        <boolean>,    // Enable/Disable automatic query recognition.    By default is true
    autoBody:         <boolean>,    // Enable/Disable automatic body recognition.     By default is true
    writeOutputFile:  <boolean>     // Enable/Disable writing the output file.        By default is true
};
/* ------------------------------------------------------- */

const swaggerAutogen = require('swagger-autogen')() // bu şekilde default ayarlar ile çalışıyor

const packageJson = require('./package.json')

const documents = {
    //bazı ayarları manuel girmem gerekiyor
    //  info:{
    //     version:'1.0.0',
    //     title: 'Personnel API',
    //     description: 'Personnel Management System API Service v.1',
    //     termOfSevice:'http://127.0.0.1:8000/#',// servis sözleşmesi varsa buraya onu URL'sini buraya belirtebiliriz
    //     contact:{name:'Abeska',email:'selmankayabas48@gmail.com'},
    //     licence:{name:'Apache Licence'}



    //  }, //! version gibi bazı bilgiler package.json'da olduğu için oradan alacağız
    info: {
        version: packageJson.version,
        title: packageJson.title,
        description: packageJson.description,
        // termOfSevice: 'http://127.0.0.1:8000/#',
        contact: { name: packageJson.author, email: 'selmankayabas48@gmail.com' },
        licence: { name: packageJson.license }
    },
    host: `${HOST}:${PORT}`,
    basePath: '/',
    schemes: ['http', 'https'],

    //SimpleToken Settings:

    //* Open Api standartları
    securityDefinitions: {
        Token: {
            type: 'apiKey', // token'ın tipi
            in:'header',
            name:'Authorization',
            description: 'Simple Token Authentication * Example: <b>Token ...tokenKey...</b>'
         }
    },

    //? yukarıda tanımlamasını yaptım.Aşağıda kullan dedik
    security:[
        {
            Token:[]
        }
    ],

    //Model definitions:
    definitions:{ // buraya modelleri yazacağım..Token Modeli yazmıyorum gizli olamsı lazım onu göndermem

        "Department": require('./src/models/department.model').schema.obj,// son yazdığım fiel'larını veriyor
        "Personnel": require('./src/models/personnel.model').schema.obj,


    }
}

const routes = ['./index.js']  //! bütün route'ların kökü kaynağı index.js'tir swagger autogen application'ı çalıştıracak bütün route'ları tek tek ziyaret edecekoradaki get post data herşeyi yakalayacakbana json ortaya çıkaracak
//* yukarıda bütün sistemi tarayacak ve ortaya json data çıkaracak.Bunu aşağıdaki swagger.json'a yazacak
const outputFile = './swagger.json'

//RUN:

swaggerAutogen(outputFile,routes,documents)

//! SWAGGER'I HER YENİLEMEK İSTEDİĞİMDE node swaggerAutogen'i çalıştır ki değişiklikler algılansın




/*----------------------------------------------------------- */