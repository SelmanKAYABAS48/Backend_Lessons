"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const router = require('express').Router()

// Call Controllers:
const { blogCategory, blogPost } = require('../controllers/blogController')


/* ------------------------------------------------------- */

// URL: /blog ->

// BlogCategory
router.route('/category')
//! /blog / category'e gidince get isteği gelirse blogCategory'i listele
    .get(blogCategory.list) // LIST
    .post(blogCategory.create) //CREATE

    router.route('/category/:categoryId') //! tek kayıt getirmek için belirttiğim yol
    .get(blogCategory.read)// buradaki read blogController'da oluşturduğum yapı
    .put(blogCategory.update)
    .patch(blogCategory.update)
    .delete(blogCategory.delete)



    // BlogPost

    router.route('/post')
//! /blog / category'e gidince get isteği gelirse blogCategory'i listele
    .get(blogPost.list) // LIST
    .post(blogPost.create) //CREATE

    router.route('/post/:postId') //! tek kayıt getirmek için belirttiğim yol
    .get(blogPost.read)// buradaki read blogController'da oluşturduğum yapı
    .put(blogPost.update)
    .patch(blogPost.update)
    .delete(blogPost.delete)
/* ------------------------------------------------------- */
module.exports = router