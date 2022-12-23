const express=require('express');
const router=express.Router();
// const usercontroller= require('./userController');
// const auth=require('../middleware/authentication');
// router.post('/register',usercontroller)
router.get('/product',(req,res)=>{
    return res.send("test m product")
    
})

module.exports=router;
