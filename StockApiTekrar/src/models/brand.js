"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "name": "Brand -1"
}
/* ------------------------------------------------------- */
// Brand Model:


const BrandSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    image: { //! image dosyanın kendisi değil dosyanın url'si
        type: String,
        trim: true
    }

}, {
    collection: 'brands',
    timestamps: true
})

/* ------------------------------------------------------- */
module.exports = mongoose.model('Brand', BrandSchema)