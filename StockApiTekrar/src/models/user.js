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

UserSchema.pre('save', function(next){

    console.log('pre-save-çalıştı');

    console.log(this);

    next() 

    //! next çalışmayınca create işlemine geçemiyor

}) //save işlemini yapmadan önce. yani create işleminden önce.Kaydetmeden önce. burada next middleware olduğunu belirtiyor

/*---------------------------------------------------------------*/

module.exports = mongoose.model('User',UserSchema)

//! Pre middleware birşeyi yapmadan önce çalışacak olan middleware
//* Post middleware yapılmak istenen şey yapıldıktan sonra çalışcak olan middleware

           /*-----------------*

           next()'ten önce console'a this yazdım ve aşağıdaki data'yı aldım.bu database'e gönderilecek olan data
{
    username: 'staff1',
    password: 'aA?123456',
    email: 'staff1@site.com',
    firstName: 'admin',
    lastName: 'admin',
    isActive: true,
    isStaff: true,
    isAdmin: true,
    _id: new ObjectId("66be240da03fc793fb0260fc"),
    createdAt: 2024-08-15T15:51:41.904Z,
    updatedAt: 2024-08-15T15:51:41.904Z
  }

           /*-----------------*/

