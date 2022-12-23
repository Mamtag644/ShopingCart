const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const userModel = require("../user/userSchema")


//********************************************************[AUTHENTICATION]************************************************************

const authentication = async (req,res,next)=>
{
    try
    {
      let token = req.headers["authorization"];
    //   console.log(token);
      if(!token) return res.status(401).send({status:false, message: "please provide token"})
      
    
      token = token.split(" ");
      console.log(token[1]);
      
      let a=jwt.verify(token[1], "productManagement");
      console.log(a)
      next();
    }

    catch (err) {
        if(err.message == "jwt expired") return res.status(401).send({ status: false, message: "JWT expired, login again" })
        if(err.message == "invalid signature") return res.status(401).send({ status: false, message: "Token is incorrect authentication failed" })
        return res.status(500).send({ status: false, error: err.message });
    }

}


//********************************************************[AUTHERIZATION]************************************************************


const autherization = async (req,res,next)=>
{
    try
    {

      let userId = req.params.userId
      if(!mongoose.isValidObjectId(userId)) return  res.status(400).send({status:false, message: "Userid is not valid" })
    

      let findUserId = await userModel.findById({userId})
      if(!findUserId)
      {
        return res.status(404).send({status:false, message: "user not found"})
      }

      if(findUserId._id !== req.loginId )
      {
        return res.status(403).send({status:false, message: "you are not Authorised person"})
      }

      next()

    }
    catch(err)
    {
        res.status(500).send({status:false, message: err.message})
    }
}



module.exports = { authentication,autherization}
