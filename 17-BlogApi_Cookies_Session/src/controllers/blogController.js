"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

// Call Models:
const { BlogCategory, BlogPost } = require('../models/blogModel')

/* ------------------------------------------------------- */
// BlogCategory Controller:

module.exports.blogCategory = {

    list: async (req, res) => {

        const data = await BlogCategory.find()

        res.status(200).send({
            error: false,
            result: data
        })

    },

    // CRUD ->

    create: async (req, res) => {

        req.body.userId = req.user?._id //! buradaki req.user middleware'den gelecek ve bunu body'deki userId'ye eşleştirdim

        req.body.content += `Author: ${req.user?.firstName} ${req.user?.lastName}`


// req.body.content += `Author: ${req.user?.firstName} ${req.user?.lastName}`
// Bu kod satırı, req.body.content adlı bir alanın sonuna, kullanıcının adını ve soyadını ekler. Parça parça inceleyelim:

// req.body.content +=
// req.body: Express.js'de, bir isteğin gövdesini (body) temsil eder. Özellikle, genellikle POST veya PUT isteklerinde gönderilen verileri içerir.
// req.body.content: Gövde içindeki content adlı bir özelliğe erişir. Bu, kullanıcının gönderdiği içerik veya metin olabilir.
// +=: Bu operatör, req.body.content'in mevcut değerinin sonuna yeni bir değer ekler. Yani, req.body.content'in mevcut içeriği korunur ve yeni değer buna eklenir.
// \Author: ${req.user?.firstName} ${req.user?.lastName}``
// Bu, template literal kullanılarak oluşturulmuş bir string ifadesidir. Template literals, değişken veya ifade sonuçlarını string içinde kolayca yerleştirmemizi sağlar.
// req.user?.firstName ve req.user?.lastName
// req.user: Bu, middleware tarafından daha önce atanan kullanıcı verilerini temsil eder.
// req.user?.firstName: req.user nesnesindeki firstName özelliğini alır. ?. (optional chaining operator) kullanılarak, req.user tanımlı değilse undefined döner ve hata fırlatmaz.
// req.user?.lastName: Benzer şekilde, req.user nesnesindeki lastName özelliğini alır.
// Sonuç
// Template literal içindeki ifade, kullanıcının adını ve soyadını içerir. Eğer req.user veya req.user.firstName veya req.user.lastName tanımlı değilse, bu alanlar undefined olur ve Author: undefined undefined gibi bir string oluşturulur. Ancak req.user ve özellikleri tanımlıysa, örneğin "John Doe" gibi bir sonuç elde edilir.

        const data = await BlogCategory.create(req.body)
        // console.log(data)

        res.status(201).send({
            error: false,
            result: data
        })

    },

    read: async (req, res) => {

        // const categoryId = req.params.categoryId
        // const data = await BlogCategory.findOne({ _id: categoryId })

        // const data = await BlogCategory.findOne({ ...filter })
        const data = await BlogCategory.findOne({ _id: req.params.categoryId })
        // const data = await BlogCategory.findById( req.params.categoryId )

        res.status(200).send({
            error: false,
            result: data
        })
    },

    update: async (req, res) => {

        // const data = await BlogCategory.updateOne({ ...filter }, { ...data })
        const data = await BlogCategory.updateOne({ _id: req.params.categoryId }, req.body)
        // const data = await BlogCategory.findByIdAndUpdate(req.params.categoryId, req.body)

        res.status(202).send({
            error: false,
            result: data, // Güncelleme işleminin sayısal değerleri.
            new: await BlogCategory.findOne({ _id: req.params.categoryId }) // Güncellenmiş datayı göster.
        })

    },

    delete: async (req, res) => {

        // const data = await BlogCategory.deleteOne({ ...filter })
        const data = await BlogCategory.deleteOne({ _id: req.params.categoryId })
        // console.log(data)

        // res.status(204).send({
        //     error: false,
        //     result: data
        // })

        if (data.deletedCount >= 1) {

            res.sendStatus(204)
            // error: false

        } else {

            res.errorStatusCode = 404
            throw new Error('Not Found.')
            // error: true

        }
    }
}

/* ------------------------------------------------------- */
// BlogPost Controller:

module.exports.blogPost = {

    list: async (req, res) => {

        // const data = await BlogPost.find({ ...filter }, { ...select })
        // const data = await BlogPost.find({}, { _id: 0, categoryId: 1, title: 1, content: 1 })
        const data = await BlogPost.find({}, { categoryId: true, title: true, content: true }).populate('categoryId')

        res.status(200).send({
            error: false,
            result: data
        })

    },

    // CRUD ->

    create: async (req, res) => {

        const data = await BlogPost.create(req.body)

        res.status(201).send({
            error: false,
            result: data
        })

    },

    read: async (req, res) => {

        const data = await BlogPost.findOne({ _id: req.params.postId }).populate('categoryId')
        // const data = await BlogPost.findOne({ _id: req.params.postId }, { categoryId: true, title: true, content: true })

        res.status(200).send({
            error: false,
            result: data
        })
    },

    update: async (req, res) => {

        const data = await BlogPost.updateOne({ _id: req.params.postId }, req.body)

        res.status(202).send({
            error: false,
            result: data, // Güncelleme işleminin sayısal değerleri.
            new: await BlogPost.findOne({ _id: req.params.postId }) // Güncellenmiş datayı göster.
        })

    },

    delete: async (req, res) => {

        const data = await BlogPost.deleteOne({ _id: req.params.postId })

        if (data.deletedCount >= 1) {

            res.sendStatus(204)

        } else {

            res.errorStatusCode = 404
            throw new Error('Not Found.')

        }
    }
}

/* ------------------------------------------------------- */