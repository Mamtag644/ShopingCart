const express=require('express');
const router=express.Router();
// const usercontroller= require('./userController');
// const auth=require('../middleware/authentication');
// router.post('/register',usercontroller)
router.get('/test',(req,res)=>{
    return res.send("test me now")
    
})

module.exports=router;
