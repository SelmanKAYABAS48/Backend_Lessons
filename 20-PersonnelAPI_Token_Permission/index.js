"use strict"

/*------*/
/*------*/

require('dotenv').config()
require('express-async-errors')
const express = require('express')



app.all('/',(req,res)=>{
    res.send('wellcome')
})

const PORT = process.env.PORT
application.listen(PORT,()=> console.log("server is running on:" ,PORT))