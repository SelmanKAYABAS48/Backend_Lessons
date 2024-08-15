"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */

const user = require('../controllers/user')

//URL: / users

router.route('/') //! users'ın an path'ine geldiğim zaman 
    .get(user.list)
    .post(user.create)

router.route('/:id')

.get(user.read) // tek bir kayıt oku manasında
.put(user.update)
.patch(user.update)
.delete(user.delete)

module.exports = router