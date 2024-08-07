//! Burada req res içermeyen genel dosyaları buradya atacağım

"use strict"

/* ------------------------------------------------------- */

// Password Encrypt (PBKDF2 Method):
// https://nodejs.org/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest

const crypto = require('node:crypto')

// Parameters:
const keyCode = process.env.SECRET_KEY // Şifreleme anahtarı.
const loopCount = 10_000 // Döngü sayısı
const charCount = 32 // write 32 for 64
const encType = 'sha512' // Şifreleme algoritması.

// Return encrypted password:
module.exports = function (password) {

    return crypto.pbkdf2Sync(password, keyCode, loopCount, charCount, encType).toString('hex')

}