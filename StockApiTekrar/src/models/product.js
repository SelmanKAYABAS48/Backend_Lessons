"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */
// Product Model:

const ProductSchema = new mongoose.Schema({

    categoryId: { //* ürünün category'si
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true, //! bir category'e birden fazla ürün bağlı olabilir..ben buraya unique desem one to one olur
    },

    brandId: { //* Ürünün markası
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },

    name: {
        type: String,
        trim: true,
        required: true,
    },

    quantity: { //? Ürünün sistemdeki adeti
        type: Number,
        default: 0
    },
    // buraya barcode da ekleyebiliriz

}, {
    collection: 'products',
    timestamps: true
})

/* ------------------------------------------------------- */
module.exports = mongoose.model('Product', ProductSchema)