"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

// Call Model:
// const User = require('../models/userModel') // Direct
const { User } = require('../models/userModel') // In Object

/* ------------------------------------------------------- */
// User Controller:

module.exports.user = {

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
        const data = await User.updateOne({ _id: req.params.userId }, req.body, { runValidators: true }) // Validate aktif et.

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