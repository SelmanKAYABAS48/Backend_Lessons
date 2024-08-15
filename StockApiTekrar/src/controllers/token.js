

//! Token controller'I işlevsel olarak kullanmıyoruz. Token create veya delete işlemlerini authentication'da yapıyoruz

"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const Token = require('../models/token')

module.exports = {
    list: async (req, res) => {
        /*
       #swagger.ignore = true
                `
            */

      const data = await res.getModelList(Token,{},'userId') //! getModelList'te custom filter var incele ..3.parametre populate yapıyor

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Token),//!kaç kayıt kaç sayfakaçıncı sayfa arama paramtreleri falan detaylar var
            data
        })
    },

    create: async (req, res) => {
        /*
       #swagger.ignore = true
                `
            */

        const data = await Token.create(req.body) //! Kayıt işlemi başarılı olmadıysa hata vs olursa Token.create kendi içinde bir hata döndürecek ve bunu error handler yakalayacak ve error handler hatayı ekrana basacak

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {

          /*
       #swagger.ignore = true
                `
            */
        const data = await Token.findOne({ _id: req.params.id }).populate('userId') //! url'de gelcek id'nin _ yok.dikkat et..

        res.status(200).send({ error: false, data })
    },
    update: async (req, res) => {
    /*
       #swagger.ignore = true
                `
            */
        const data = await Token.updateOne({ _id: req.params.id }, req.body, { unValidators: true }) // update'te de validasyon için bunu eklmemiz lazım

        res.status(202).send({
            error: false,
            data, // burada 1 tane kayıt güncelledi gibi data döner
            new: await Token.findOne({ _id: req.params.id }) //güncelleme yapılan kayıtı bize getirir.eğer bunu yapmazsak read'ten alabilriz bunu ancak kolay yöntem
        })
    },

    delete:async (req,res)=>{

         /*
       #swagger.ignore = true
                `
            */
        const data = await Token.deleteOne({_id:req.params.id})

        res.status(data.deletedCount ? 204:404).send({
        
           error:!data.deletedCount,// kayıt silindi ise false silinmedi ise true verecek ve hta çıkacak 
            data
        })
    }

}