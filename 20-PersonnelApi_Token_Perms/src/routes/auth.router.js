"use strict"

const router = require('express').Router()

const auth = require("../controllers/auth.controller")

/*----------------------------------*/

//Başlangıç URL :/auth/login || /logout

router.post('./login',auth.login)
router.all('./logout',auth.login) // bütün istekler için geçerli