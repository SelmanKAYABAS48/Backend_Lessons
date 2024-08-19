"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const user = require('../models/user')
const token = require('../models/token')
const jwt = require('jsonwebtoken')

module.exports = {

    login:async (req,res)=>{

            /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

            const { username,email,password} = req.body // req.body' gönderilen verileri alıyoruz

            if((username ||email) && password){ 
                // email ve password geldi ve bunu database'de sorgulayacağız



            }
            else{
                res.errorStatusCode = 401
                throw new Error('Please enter username/email and password.')
            }

    },

    refresh:async(req,res)=>{

         /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh access-token by refresh-token.'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    bearer: {
                        refresh: '___refreshToken___'
                    }
                }
            }
        */

    },

    logout:async(req,res)=>{

             /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Token: Logout"
            #swagger.description = 'Delete token-key.'
        */


    }


}