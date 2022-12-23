const express=require('express');
const router=express.Router();
const {createUser,loginUser,getUser,updateUser}= require('./userController');
const {authentication}  = require('../middleware/authentication');
router.post('/register',createUser);
router.post('/login',loginUser);
router.get('/:userId/profile',authentication,getUser);
router.put('/:userId/profile',updateUser)


// router.get('/test',(req,res)=>{
//     return res.send("test me now")
    
// })

module.exports=router;
