"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const token = require('../controllers/token')

//URL: / tokens

router.route('/') 
    .get(token.list)
    .post(token.create)

router.route('/:id')

.get(token.read) // tek bir kayıt oku manasında
.put(token.update)
.patch(token.update)
.delete(token.delete)

module.exports = router