"use strict"

//! ilk önce models'ten UserModel'i require et


//* Call Model
// const User = require('../models/userModel') //? direk gönderdiysem bu şekilde alırım
const { User } = require('../models/userModel') 
//! model'den obje olarak gönderdiğim için destructing olarak çıkardım
/*--------------------------------*/

// User Controller:
module.exports.user = { //! Önemli exports yaparken obje olarak yani .user oalrak gönderdim router'da require ederken obje içinde al

    list: async (req, res) => {

        const data = await User.find()

        res.status(200).send({
            error: false,
            result: data
        })

    },

    // CRUD ->

    create: async (req, res) => {

        const data = await User.create(req.body)

        res.status(201).send({
            error: false,
            result: data
        })

    },

    read: async (req, res) => {

        const data = await User.findOne({ _id: req.params.userId })

        res.status(200).send({
            error: false,
            result: data
        })
    },

    update: async (req, res) => {

        // const data = await User.updateOne({ _id: req.params.userId }, req.body)
        const data = await User.updateOne({ _id: req.params.userId }, req.body, { runValidators: true }) // Validate aktif et. update yaparken validate'i aktif ederburası false olursa model'de kurduğum set yapsında 8 karakter yapısı tanmıyor yani 3 karakter yazsam bile kabul ediyor

        res.status(202).send({
            error: false,
            result: data, // Güncelleme işleminin sayısal değerleri.
            new: await User.findOne({ _id: req.params.userId }) // Güncellenmiş datayı göster.
        })

    },

    delete: async (req, res) => {

        const data = await User.deleteOne({ _id: req.params.userId })

        if (data.deletedCount >= 1) {

            res.sendStatus(204)

        } else {

            res.errorStatusCode = 404
            throw new Error('Not Found.')

        }
    }
}

/* ------------------------------------------------------- */

//! Buradan sonra router'ı ayarla