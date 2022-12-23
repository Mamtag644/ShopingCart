const express=require('express');
const router= express.Router();
const userRoute=require('../user/index.js');
const productRoute=require('../product/index')
const cartRoute=require('../cart/index')
const orderRoute=require('../order/index.js');


// router.use('/',(req,res)=>{
//     console.log("hii its me")
//     res.send('its me')

// });

router.use('/user',userRoute);
router.use('/product',productRoute);
router.use('/cart',cartRoute);
router.use('/order',orderRoute);

router.all('/**',(req,res)=>{
    return res.status(404).send("Url is not found")

})

module.exports=router;

