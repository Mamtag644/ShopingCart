const express= require('express');
const app= express();
const router= require('./routes/routes.js');
const connection =require('./db.js');
const multer= require('multer');



app.use(express.json());
app.use(multer().any());

// ============= database connection===============
connection();
app.use('/',router);
// console.log(process.env.PORT)
app.listen( process.env.PORT ||3000,()=>{
    console.log(`Express App running on port ${process.env.PORT ||3000}`)
});