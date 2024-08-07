"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */
// Mongoose:

const mongoose = require('mongoose')

/* ------------------------------------------------------- *

// const ModelName = new mongoose.Schema({ ...fields }, { ...settings })
const ModelSchema = new mongoose.Schema(
    {

        // PrimaryKey (_id) tanımlamaya gerek yoktur. Otomatik tanımlanır.
        // _id: Number

        fieldName: {
            type: Number, // JS Veri tipi.
            default: null, // Veri gelmediğinde yazılacak veri.
            trim: true, // Başındaki/sonundaki boşlukları kırpar. (String)
            unique: true, // Benzersiz kayıt.
            index: true, // Aramalarda hızlı erişim sağlar.
            // required: true, // Veri gönderimi zorunlu mu?
            required: [true, 'Bu data mutlaka gönderilmelidir.'], // [Veri gönderimi zorunlu mu?, HATA MESAJI]
            // enum: ['1', '2', '3'],
            // enum: [1, 2, 3], // Belirli değerlerden biri olmak zorunda.
            enum: [[1, 2, 3], 'Bu değerlerden biri olmalıdır.'], // Belirli değerlerden biri olmak zorunda.
            // validate: (data) => true, // Gelen data formatının doğrulunu kontrol etme.
            validate: [
                (data) => { return true },
                'GÖnderilen data formatı yanlıştır.'
            ], // Gelen data formatının doğrulunu kontrol etme.
            get: (data) => data, // Bu field'a erişilmek istendiğinde otomatik çalışan fonksion.
            set: (data) => data, // Bu field'a veri kaydedilmek istendiğinde otomatik çalışan fonksion.
        },

        fieldName2: String, // ShortHand


    }, {
        collection: 'tableName', // Tablo İsmi
        timestamps: true // createdAt ve updatedAt otomatik yönetilsin. (tanımlamaya gerek yok)
    }
)

const ModelName = mongoose.model('ModelName', ModelSchema)

/* ------------------------------------------------------- */
// BlogCategory Schema:

const BlogCategorySchema = new mongoose.Schema({

    // _id

    name: {
        type: String,
        trim: true,
        required: true
    }

}, {
    collection: 'blogCategories',
    timestamps: true
})

// Set Model:
// const BlogCategory = mongoose.model('BlogCategory', BlogCategorySchema)

/* ------------------------------------------------------- */
// BlogPost Schema:

const BlogPostSchema = new mongoose.Schema({

    // _id

    categoryId: { // Default Relation: ManyToOne
        type: mongoose.Schema.Types.ObjectId, // Hexadecimal Format: 'fedcba9876543210'
        ref: 'BlogCategory', // ID hangi Model'e ait. (mongoose.model('ModelName', Schema))
        required: true,
        // unique: true, // Convert to OneToOne Relation.
    },

    title: {
        type: String,
        trim: true,
        required: true
    },

    content: {
        type: String,
        trim: true,
        required: true
    },

    // createdAt // timestamps: true
    // updatedAt // timestamps: true

}, {
    collection: 'blogPosts',
    timestamps: true
})

// Set Model:
// const BlogPost = mongoose.model('BlogPost', BlogPostSchema)

/* ------------------------------------------------------- */

// module.exports = {
//     BlogCategory: BlogCategory,
//     BlogPost: BlogPost
// }

/* ------------------------------------------------------- */

module.exports = {
    BlogCategory: mongoose.model('BlogCategory', BlogCategorySchema),
    BlogPost: mongoose.model('BlogPost', BlogPostSchema)
}