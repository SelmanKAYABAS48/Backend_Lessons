"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// routes/auth:

const auth = require("../controllers/auth");

// URL: /auth

// Login/logout:
router.post("/login", auth.login); // Login and get Token or JWT
router.post("/refresh", auth.refresh); // JWT: Refresh
// router.all('/logout', auth.logout)
router.get("/logout", auth.logout); // Token Logout

/* ------------------------------------------------------- */
module.exports = router;

