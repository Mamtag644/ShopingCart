const mongoose = require('mongoose');
require('dotenv').config();

module.exports=()=>{

        mongoose.set({strictQuery:true})
        mongoose.connect(process.env.DB,{useNewUrlParser:true})
        .then(()=>{console.log("database is connected")})
        .catch(err=>console.log(err.message))  
}